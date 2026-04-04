import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role for admin overrides
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Season 1 airdrop: Mintiņš distributed via claim window at end of season, not per-task.
// XP accumulates here. Token distribution happens separately when claim window opens.

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { taskId, xpAmount } = await req.json();

        if (!taskId || !xpAmount) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 1. Check if already claimed
        const { data: existingClaim } = await supabase
            .from('xp_claims')
            .select('*')
            .eq('user_email', session.user.email)
            .eq('task_id', taskId)
            .single();

        if (existingClaim) {
            return NextResponse.json({ error: 'Already claimed' }, { status: 400 });
        }

        // 2. Fetch current profile
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.user.email)
            .single();

        if (pError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const oldLevel = profile.level || 1;
        const newTotalXp = (Number(profile.total_xp) || 0) + xpAmount;
        
        // Simple level logic: Level = floor(sqrt(xp / 100)) + 1
        const newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;

        // 3. Update Profile & Record Claim
        const { error: upsertError } = await supabase.from('profiles').update({
            total_xp: newTotalXp,
            level: newLevel
        }).eq('email', session.user.email);

        if (upsertError) throw upsertError;

        await supabase.from('xp_claims').insert({
            user_email: session.user.email,
            task_id: taskId,
            xp_amount: xpAmount
        });

        if (newLevel > oldLevel) {
            console.log(`[XP System] Level up: ${oldLevel} -> ${newLevel} for ${session.user.email}. XP recorded for Season 1 claim window.`);
        }

        return NextResponse.json({
            success: true, 
            newTotalXp, 
            newLevel,
            leveledUp: newLevel > oldLevel 
        });

    } catch (error: any) {
        console.error("[XP Claim Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
