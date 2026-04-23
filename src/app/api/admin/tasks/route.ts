import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';
import { isAdminEmail } from '@/lib/admin';
import { syncUserToGHL } from '@/lib/ghlSync';

export const dynamic = 'force-dynamic';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!isAdminEmail(session?.user?.email)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(req.url);
    const statusFilter = url.searchParams.get('status') || 'pending';

    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('task_submissions')
        .select('id, user_email, task_id, proof_url, status, submitted_at, reviewed_at, reviewed_by, admin_notes')
        .eq('status', statusFilter)
        .order('submitted_at', { ascending: false })
        .limit(200);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Hydrate task titles + xp
    const taskIds = Array.from(new Set((data || []).map((s) => s.task_id)));
    const { data: tasks } = await supabase
        .from('task_catalog')
        .select('id, title_lv, xp_amount, pillar, tier')
        .in('id', taskIds);

    const taskMap = new Map((tasks || []).map((t) => [t.id, t]));
    const rows = (data || []).map((s) => ({
        ...s,
        task: taskMap.get(s.task_id) || null,
    }));

    return NextResponse.json({ submissions: rows });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const reviewer = session?.user?.email;
    if (!isAdminEmail(reviewer)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body: { submission_id?: string; action?: 'approve' | 'reject'; notes?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { submission_id, action, notes } = body;
    if (!submission_id || (action !== 'approve' && action !== 'reject')) {
        return NextResponse.json({ error: 'Missing submission_id or invalid action' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: sub, error: subErr } = await supabase
        .from('task_submissions')
        .select('id, user_email, task_id, status')
        .eq('id', submission_id)
        .maybeSingle();

    if (subErr || !sub) {
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }
    if (sub.status !== 'pending') {
        return NextResponse.json({ error: `Already ${sub.status}` }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const { error: updErr } = await supabase
        .from('task_submissions')
        .update({
            status: newStatus,
            admin_notes: notes || null,
            reviewed_at: now,
            reviewed_by: reviewer,
        })
        .eq('id', submission_id);

    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

    // On approve: award XP (idempotent via xp_claims unique task_id per user)
    if (action === 'approve') {
        const { data: task } = await supabase
            .from('task_catalog')
            .select('xp_amount')
            .eq('id', sub.task_id)
            .maybeSingle();

        if (task) {
            const { data: alreadyClaimed } = await supabase
                .from('xp_claims')
                .select('task_id')
                .eq('user_email', sub.user_email)
                .eq('task_id', sub.task_id)
                .maybeSingle();

            if (!alreadyClaimed) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('total_xp')
                    .eq('email', sub.user_email)
                    .maybeSingle();
                const newTotalXp = Number(profile?.total_xp || 0) + Number(task.xp_amount);
                const newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;

                await Promise.all([
                    supabase.from('xp_claims').insert({
                        user_email: sub.user_email,
                        task_id: sub.task_id,
                        xp_amount: task.xp_amount,
                    }),
                    supabase.from('profiles').update({
                        total_xp: newTotalXp,
                        level: newLevel,
                    }).eq('email', sub.user_email),
                ]);

                void syncUserToGHL(sub.user_email, { total_xp: newTotalXp, level: newLevel });
            }
        }
    }

    return NextResponse.json({ success: true, status: newStatus });
}
