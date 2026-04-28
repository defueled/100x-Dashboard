import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// 5-min cache — leaderboard doesn't need to be real-time
let cache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(): Promise<NextResponse> {
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
        return NextResponse.json({ members: cache.data });
    }

    const supabase = getSupabase();
    // Gate the leaderboard on real subscribers — non-paying Gmail sign-ups
    // get a profile row but should not appear until `abonements💰` is set.
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_subscribed', true)
        .order('total_xp', { ascending: false })
        .limit(20);

    if (error) {
        console.error('[Leaderboard] Supabase error:', error.message);
        return NextResponse.json({ members: [], error: error.message });
    }

    const members = (data || []).map((m: Record<string, unknown>, i) => {
        const xp = Number(m.total_xp ?? 0);
        const streak = Number(m.gm_streak ?? m.streak ?? 0);
        const name =
            (m.display_name as string) ||
            (m.full_name as string) ||
            (m.name as string) ||
            ((m.email as string)?.split('@')[0]) ||
            'Anonymous';
        return {
            rank: i + 1,
            name,
            avatar: (m.avatar_url as string) || (m.avatar as string) || null,
            xp,
            streak,
            level: Math.floor(Math.sqrt(xp / 100)) + 1,
        };
    });

    cache = { data: members, ts: Date.now() };
    console.log(`[Leaderboard] Fetched ${members.length} members`);
    return NextResponse.json({ members });
}
