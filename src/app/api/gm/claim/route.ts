import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { supabase } from '@/lib/supabase';
import { syncUserToGHL } from '@/lib/ghlSync';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = session.user.email;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        // 1. Get current profile
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('last_gm_at, gm_streak, total_xp, level')
            .eq('email', email)
            .single();

        if (pError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const lastGm = profile.last_gm_at ? new Date(profile.last_gm_at) : null;
        const lastGmDate = lastGm ? new Date(lastGm.getFullYear(), lastGm.getMonth(), lastGm.getDate()).getTime() : 0;

        // Check if already claimed today
        if (lastGmDate === today) {
            return NextResponse.json({ error: 'Already claimed today' }, { status: 400 });
        }

        // 2. Calculate new streak
        const yesterday = today - (24 * 60 * 60 * 1000);
        let newStreak = 1;
        if (lastGmDate === yesterday) {
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

        // 5. Record claim in xp_claims (with unique daily ID)
        const dayString = now.toISOString().split('T')[0];
        const taskId = `daily_gm_${dayString}`;
        
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
            multiplier: `${multiplier}x`
        });

    } catch (error: any) {
        console.error('GM Claim Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
