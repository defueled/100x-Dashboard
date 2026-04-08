import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';
import { syncUserToGHL } from '@/lib/ghlSync';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { display_name, goals, skill_level, referral_source } = await req.json();

    const supabase = getSupabase();
    const { error } = await supabase
        .from('profiles')
        .update({
            display_name: display_name || null,
            goals: goals || null,
            skill_level: skill_level || null,
            referral_source: referral_source || null,
            onboarding_complete: true,
        })
        .eq('email', session.user.email);

    if (error) {
        console.error('[Onboarding] Supabase update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fire-and-forget GHL sync
    void syncUserToGHL(session.user.email, {
        display_name: display_name || undefined,
        skill_level: skill_level || undefined,
        onboarding_complete: true,
    });

    // Award 50 XP — only if not already claimed
    const { data: existing } = await supabase
        .from('xp_claims')
        .select('task_id')
        .eq('user_email', session.user.email)
        .eq('task_id', 'onboarding_complete')
        .maybeSingle();

    if (!existing) {
        // Fetch current XP so we can increment it
        const { data: profile } = await supabase
            .from('profiles')
            .select('total_xp')
            .eq('email', session.user.email)
            .single();

        const newTotalXp = (Number(profile?.total_xp) || 0) + 50;
        const newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;

        await Promise.all([
            supabase.from('xp_claims').insert({
                user_email: session.user.email,
                task_id: 'onboarding_complete',
                xp_amount: 50,
            }),
            supabase.from('profiles').update({
                total_xp: newTotalXp,
                level: newLevel,
            }).eq('email', session.user.email),
        ]);

        void syncUserToGHL(session.user.email, { total_xp: newTotalXp, level: newLevel });
    }

    return NextResponse.json({ success: true });
}
