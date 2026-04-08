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
    const { data, error } = await supabase
        .from('profiles')
        .select('display_name, full_name, avatar_url, total_xp, gm_streak, level')
        .order('total_xp', { ascending: false })
        .limit(20);

    if (error) {
        console.error('[Leaderboard] Supabase error:', error.message);
        return NextResponse.json({ members: [] });
    }

    const members = (data || []).map((m, i) => ({
        rank: i + 1,
        name: m.display_name || m.full_name || 'Anonomous',
        avatar: m.avatar_url || null,
        xp: m.total_xp || 0,
        streak: m.gm_streak || 0,
        level: m.level || 1,
    }));

    cache = { data: members, ts: Date.now() };
    console.log(`[Leaderboard] Fetched ${members.length} members`);
    return NextResponse.json({ members });
}
