import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';
import { syncUserToGHL } from '@/lib/ghlSync';

// Service-role client — anon-keyed client silently no-ops UPDATE under RLS
// and makes GM claims look successful without actually changing the row.
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = session.user.email;
        const supabase = getSupabase();
        const now = new Date();

        // GM cooldown: 12 hours between claims. Streak still increments per
        // claim (not per calendar day), capped at 100.
        const COOLDOWN_MS = 12 * 60 * 60 * 1000;
        // Streak window: claim within 2× cooldown (24h) to keep streak alive.
        const STREAK_WINDOW_MS = 2 * COOLDOWN_MS;

        // 1. Get current profile
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('last_gm_at, gm_streak, total_xp, level')
            .eq('email', email)
            .single();

        if (pError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const lastGmMs = profile.last_gm_at ? new Date(profile.last_gm_at).getTime() : 0;
        const sinceLast = lastGmMs ? now.getTime() - lastGmMs : Infinity;

        if (sinceLast < COOLDOWN_MS) {
            const nextAt = new Date(lastGmMs + COOLDOWN_MS).toISOString();
            return NextResponse.json({ error: 'Cooldown active', nextAt }, { status: 400 });
        }

        // 2. Calculate new streak — +1 if claim lands within the streak window,
        //    reset to 1 if the window lapsed.
        let newStreak = 1;
        if (lastGmMs && sinceLast <= STREAK_WINDOW_MS) {
            newStreak = (profile.gm_streak || 0) + 1;
        }

        // Cap streak/multiplier at 100
        newStreak = Math.min(newStreak, 100);

        // 3. Award flat 100 XP per day. Streak is the season claim multiplier,
        //    not a per-day XP multiplier. At season end: Mintiņš = total_xp × gm_streak.
        const baseXp = 100;
        const multiplier = newStreak; // season multiplier (shown in UI, applied at claim window)
        const totalXpAwarded = baseXp;

        const newTotalXp = Number(profile.total_xp || 0) + totalXpAwarded;
        
        // 4. Update Profile
        const { error: uError } = await supabase
            .from('profiles')
            .update({
                last_gm_at: now.toISOString(),
                gm_streak: newStreak,
                total_xp: newTotalXp
            })
            .eq('email', email);

        if (uError) throw uError;

        // Fire-and-forget GHL sync
        const newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;
        void syncUserToGHL(email, { total_xp: newTotalXp, gm_streak: newStreak, level: newLevel });

        // 5. Record claim in xp_claims. Use timestamped ID so a user can
        //    have multiple GM rows per day under the 12h cooldown.
        const taskId = `gm_${now.toISOString()}`;

        await supabase
            .from('xp_claims')
            .insert({
                user_email: email,
                task_id: taskId,
                xp_amount: totalXpAwarded
            });

        return NextResponse.json({
            success: true,
            xpCount: totalXpAwarded,
            streak: newStreak,
            lastGmAt: now.toISOString(),
            multiplier: `${multiplier}x`
        });

    } catch (error: any) {
        console.error('GM Claim Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
