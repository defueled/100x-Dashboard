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

function isReasonableUrl(s: string): boolean {
    try {
        const u = new URL(s);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
}

function isTxHash(s: string): boolean {
    return /^0x[0-9a-fA-F]{64}$/.test(s.trim());
}

function isEvmAddress(s: string): boolean {
    return /^0x[0-9a-fA-F]{40}$/.test(s.trim());
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { task_id?: string; proof?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const taskId = (body.task_id || '').trim();
    const proof = (body.proof || '').trim();
    if (!taskId || !proof) {
        return NextResponse.json({ error: 'Trūkst task_id vai proof' }, { status: 400 });
    }
    if (proof.length > 2000) {
        return NextResponse.json({ error: 'Pierādījums par garu' }, { status: 400 });
    }

    const email = session.user.email;
    const supabase = getSupabase();

    // Load task + existing submission
    const [taskRes, existingRes] = await Promise.all([
        supabase.from('task_catalog').select('*').eq('id', taskId).eq('active', true).maybeSingle(),
        supabase.from('task_submissions').select('*').eq('user_email', email).eq('task_id', taskId).maybeSingle(),
    ]);

    if (!taskRes.data) {
        return NextResponse.json({ error: 'Uzdevums nav atrasts' }, { status: 404 });
    }
    const task = taskRes.data;

    // Don't allow resubmission if already approved
    if (existingRes.data?.status === 'approved') {
        return NextResponse.json({ error: 'Jau apstiprināts' }, { status: 400 });
    }

    // Validate proof by type
    const proofType = task.proof_type as 'url' | 'tx_hash' | 'admin_review';
    if (proofType === 'url') {
        if (!isReasonableUrl(proof) && !isEvmAddress(proof)) {
            return NextResponse.json({ error: 'Nederīga URL vai adrese' }, { status: 400 });
        }
    } else if (proofType === 'tx_hash') {
        if (!isTxHash(proof)) {
            return NextResponse.json({ error: 'Nederīgs tx hash (0x + 64 simboli)' }, { status: 400 });
        }
    } else if (proofType === 'admin_review') {
        if (!isReasonableUrl(proof)) {
            return NextResponse.json({ error: 'Nepieciešama URL pierādījuma saite' }, { status: 400 });
        }
    }

    // If task requires a forum proof, force the URL to be platforma.100x.lv.
    // Skip enforcement for tx_hash proof or EVM address proof.
    if (task.requires_forum_proof && proofType !== 'tx_hash' && !isEvmAddress(proof)) {
        try {
            const u = new URL(proof);
            if (u.hostname !== 'platforma.100x.lv') {
                return NextResponse.json({
                    error: 'Šim uzdevumam pierādījumam jābūt no platforma.100x.lv (mūsu komūnas forums)',
                }, { status: 400 });
            }
        } catch {
            return NextResponse.json({ error: 'Nederīga URL' }, { status: 400 });
        }
    }

    const autoApprove = Boolean(task.auto_approve);
    const newStatus = autoApprove ? 'approved' : 'pending';
    const now = new Date().toISOString();

    // Upsert submission
    const { error: upsertErr } = await supabase
        .from('task_submissions')
        .upsert({
            user_email: email,
            task_id: taskId,
            proof_url: proof,
            status: newStatus,
            submitted_at: now,
            reviewed_at: autoApprove ? now : null,
            reviewed_by: autoApprove ? 'auto' : null,
            admin_notes: null,
        }, { onConflict: 'user_email,task_id' });

    if (upsertErr) {
        return NextResponse.json({ error: upsertErr.message }, { status: 500 });
    }

    // If auto-approved, award BONUS XP immediately (base XP is a separate /claim call)
    const bonusXp = Number(task.bonus_xp ?? task.xp_amount ?? 0);
    let awardedXp = 0;
    if (autoApprove) {
        const { data: alreadyClaimed } = await supabase
            .from('xp_claims')
            .select('task_id')
            .eq('user_email', email)
            .eq('task_id', taskId)
            .eq('claim_type', 'bonus')
            .maybeSingle();

        if (!alreadyClaimed && bonusXp > 0) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('total_xp')
                .eq('email', email)
                .maybeSingle();
            const newTotalXp = Number(profile?.total_xp || 0) + bonusXp;
            const newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;

            const [claimRes, updRes] = await Promise.all([
                supabase.from('xp_claims').insert({
                    user_email: email,
                    task_id: taskId,
                    xp_amount: bonusXp,
                    claim_type: 'bonus',
                }),
                supabase.from('profiles').update({
                    total_xp: newTotalXp,
                    level: newLevel,
                }).eq('email', email),
            ]);

            if (!claimRes.error && !updRes.error) {
                awardedXp = bonusXp;
                void syncUserToGHL(email, { total_xp: newTotalXp, level: newLevel });
            }
        }
    }

    return NextResponse.json({
        success: true,
        status: newStatus,
        awardedXp,
        message: autoApprove
            ? `Forumā pierādījums apstiprināts. +${awardedXp} XP bonuss`
            : 'Pierādījums iesniegts izskatīšanai',
    });
}
