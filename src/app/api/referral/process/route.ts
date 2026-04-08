import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

const REFERRAL_XP = 100;

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const refCode = cookieStore.get('ref_code')?.value;
    if (!refCode) {
        return NextResponse.json({ skipped: true });
    }

    const email = session.user.email;

    // Find the new user's profile
    const { data: newUser } = await supabase
        .from('profiles')
        .select('id, referred_by, referral_code')
        .eq('email', email)
        .single();

    if (!newUser) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Already processed
    if (newUser.referred_by) {
        return NextResponse.json({ skipped: true, reason: 'already_referred' });
    }

    // Find referrer by code
    const { data: referrer } = await supabase
        .from('profiles')
        .select('id, email, total_xp, referral_count')
        .eq('referral_code', refCode)
        .single();

    // Don't self-refer
    if (!referrer || referrer.email === email) {
        return NextResponse.json({ skipped: true, reason: 'invalid_code' });
    }

    // Award XP to referrer + increment count
    const newXp = (referrer.total_xp || 0) + REFERRAL_XP;
    const newCount = (referrer.referral_count || 0) + 1;

    const [xpResult, refResult] = await Promise.all([
        supabase.from('profiles').update({ total_xp: newXp, referral_count: newCount }).eq('id', referrer.id),
        supabase.from('profiles').update({ referred_by: refCode }).eq('email', email),
    ]);

    if (xpResult.error || refResult.error) {
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
    }

    // Record XP claim for referrer
    await supabase.from('xp_claims').insert({
        profile_id: referrer.id,
        task_id: `referral_${email}`,
        xp_amount: REFERRAL_XP,
        source: 'referral',
    }).select();

    return NextResponse.json({ success: true, referrerEmail: referrer.email, xpAwarded: REFERRAL_XP });
}
