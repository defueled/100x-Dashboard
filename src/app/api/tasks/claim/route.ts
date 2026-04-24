import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';
import { syncUserToGHL } from '@/lib/ghlSync';

export const dynamic = 'force-dynamic';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { task_id?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const taskId = (body.task_id || '').trim();
    if (!taskId) {
        return NextResponse.json({ error: 'Trūkst task_id' }, { status: 400 });
    }

    const email = session.user.email;
    const supabase = getSupabase();

    const [taskRes, existingClaimRes] = await Promise.all([
        supabase.from('task_catalog').select('id, base_xp, active').eq('id', taskId).maybeSingle(),
        supabase
            .from('xp_claims')
            .select('task_id')
            .eq('user_email', email)
            .eq('task_id', taskId)
            .eq('claim_type', 'base')
            .maybeSingle(),
    ]);

    if (!taskRes.data || !taskRes.data.active) {
        return NextResponse.json({ error: 'Uzdevums nav atrasts' }, { status: 404 });
    }
    if (existingClaimRes.data) {
        return NextResponse.json({ error: 'Bāzes XP jau iegūti' }, { status: 400 });
    }

    const baseXp = Number(taskRes.data.base_xp || 0);
    if (baseXp <= 0) {
        return NextResponse.json({ error: 'Bāzes XP nav pieejami šim uzdevumam' }, { status: 400 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('email', email)
        .maybeSingle();
    const newTotalXp = Number(profile?.total_xp || 0) + baseXp;
    const newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;

    const [claimRes, updRes] = await Promise.all([
        supabase.from('xp_claims').insert({
            user_email: email,
            task_id: taskId,
            xp_amount: baseXp,
            claim_type: 'base',
        }),
        supabase
            .from('profiles')
            .update({ total_xp: newTotalXp, level: newLevel })
            .eq('email', email),
    ]);

    if (claimRes.error) {
        return NextResponse.json({ error: claimRes.error.message }, { status: 500 });
    }
    if (updRes.error) {
        return NextResponse.json({ error: updRes.error.message }, { status: 500 });
    }

    void syncUserToGHL(email, { total_xp: newTotalXp, level: newLevel });

    return NextResponse.json({
        success: true,
        awardedXp: baseXp,
        totalXp: newTotalXp,
        level: newLevel,
        message: `Bāze iegūta. +${baseXp} XP`,
    });
}
