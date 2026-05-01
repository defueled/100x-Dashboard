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

    let body: { task_id?: string; score?: number; total?: number };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const taskId = (body.task_id || '').trim();
    const score = Math.max(0, Math.floor(Number(body.score ?? 0)));
    const total = Math.max(0, Math.floor(Number(body.total ?? 0)));

    if (!taskId) return NextResponse.json({ error: 'Trūkst task_id' }, { status: 400 });
    if (total <= 0) return NextResponse.json({ error: 'Tests nav korekts' }, { status: 400 });
    if (score > total) return NextResponse.json({ error: 'Score > total' }, { status: 400 });

    const email = session.user.email;
    const supabase = getSupabase();

    // Server-recompute XP from authoritative task_catalog — never trust client xp_amount
    const [taskRes, existingClaimRes] = await Promise.all([
        supabase.from('task_catalog').select('id, base_xp, bonus_xp, xp_amount, active').eq('id', taskId).maybeSingle(),
        supabase
            .from('xp_claims')
            .select('task_id, claim_type')
            .eq('user_email', email)
            .eq('task_id', taskId)
            .maybeSingle(),
    ]);

    if (!taskRes.data || !taskRes.data.active) {
        return NextResponse.json({ error: 'Uzdevums nav atrasts' }, { status: 404 });
    }
    if (existingClaimRes.data) {
        return NextResponse.json({ error: 'Šim uzdevumam XP jau iekasēts' }, { status: 409 });
    }

    const baseXp = Number(taskRes.data.base_xp ?? taskRes.data.xp_amount ?? 0);
    const bonusXp = Number(taskRes.data.bonus_xp ?? 0);

    const fraction = score / total;
    const baseAward = Math.round(fraction * baseXp);
    const bonusAward = score === total ? bonusXp : 0;
    const awardedXp = baseAward + bonusAward;

    if (awardedXp <= 0) {
        return NextResponse.json({ error: 'Vajag vismaz vienu pareizu atbildi' }, { status: 400 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('email', email)
        .maybeSingle();
    const newTotalXp = Number(profile?.total_xp || 0) + awardedXp;
    const newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;

    const [claimRes, updRes] = await Promise.all([
        supabase.from('xp_claims').insert({
            user_email: email,
            task_id: taskId,
            xp_amount: awardedXp,
            claim_type: 'quiz',
        }),
        supabase
            .from('profiles')
            .update({ total_xp: newTotalXp, level: newLevel })
            .eq('email', email),
    ]);

    if (claimRes.error) {
        // 23505 = unique violation → race-condition idempotency catch
        if (claimRes.error.code === '23505') {
            return NextResponse.json({ error: 'Šim uzdevumam XP jau iekasēts' }, { status: 409 });
        }
        return NextResponse.json({ error: claimRes.error.message }, { status: 500 });
    }
    if (updRes.error) {
        return NextResponse.json({ error: updRes.error.message }, { status: 500 });
    }

    void syncUserToGHL(email, { total_xp: newTotalXp, level: newLevel });

    return NextResponse.json({
        success: true,
        score,
        total,
        baseAward,
        bonusAward,
        awardedXp,
        totalXp: newTotalXp,
        level: newLevel,
        message: bonusAward > 0
            ? `Perfekti! +${awardedXp} XP (ar bonusu)`
            : `+${awardedXp} XP iekasēti`,
    });
}
