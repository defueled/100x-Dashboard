import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';

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

    // Award 50 XP for completing onboarding
    const now = new Date().toISOString();
    await supabase.from('xp_claims').upsert(
        {
            user_email: session.user.email,
            task_id: 'onboarding_complete',
            xp_amount: 50,
            claimed_at: now,
        },
        { onConflict: 'user_email,task_id', ignoreDuplicates: true }
    );

    return NextResponse.json({ success: true });
}
