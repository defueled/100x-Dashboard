import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();
    const [catalogRes, submissionsRes] = await Promise.all([
        supabase
            .from('task_catalog')
            .select('*')
            .eq('active', true)
            .order('pillar', { ascending: true })
            .order('tier', { ascending: true })
            .order('position', { ascending: true }),
        supabase
            .from('task_submissions')
            .select('task_id, status, proof_url, submitted_at, reviewed_at, admin_notes')
            .eq('user_email', session.user.email),
    ]);

    if (catalogRes.error) {
        return NextResponse.json({ error: catalogRes.error.message }, { status: 500 });
    }

    return NextResponse.json({
        tasks: catalogRes.data || [],
        submissions: submissionsRes.data || [],
    });
}
