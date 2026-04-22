import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();
    const email = session.user.email;

    const [progressRes, claimsRes, profileRes] = await Promise.all([
        supabase.from('user_progress').select('*').eq('user_email', email),
        supabase.from('xp_claims').select('*').eq('user_email', email),
        supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle(),
    ]);

    const progress = [
        ...(progressRes.data || []),
        ...(claimsRes.data || []).map((c: any) => ({
            id: c.id,
            quest_id: c.task_id,
            xp_earned: c.xp_amount,
            status: 'completed',
            progress: 100,
        })),
    ];

    return NextResponse.json({
        progress,
        profile: profileRes.data || null,
        profileError: profileRes.error?.message ?? null,
    });
}
