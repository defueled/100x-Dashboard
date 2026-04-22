import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_FIELD_EVM = 'DwkIM1fCcBTwQy3nKVsW';   // EVM adrese
const GHL_FIELD_SOCIALS = 'oGcIVxfZ8irbsepc4xVj';
const GHL_FIELD_TOTAL_XP = 'ozhvo3NUTjUZqNatxJtx';
const GHL_FIELD_LEVEL = 'UYH1zSoZ2MHD0mYV0EZU';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = session.user.email;
        const { evm_address, profile_description, display_name, socials } = await req.json();
        const supabase = getSupabase();

        // Read existing profile so we can detect "first-time EVM" for XP award.
        const { data: existing } = await supabase
            .from('profiles')
            .select('evm_address, total_xp')
            .eq('email', email)
            .maybeSingle();

        const previousEvm = (existing?.evm_address || '').toLowerCase();
        const newEvm = (evm_address || '').toLowerCase();
        const isFirstEvm = Boolean(newEvm && newEvm !== previousEvm);

        // 1. Save to Supabase (authoritative)
        const { error: dbError } = await supabase
            .from('profiles')
            .update({
                evm_address: evm_address || null,
                profile_description: profile_description || null,
                display_name: display_name || null,
                socials: socials || {},
            })
            .eq('email', email);

        if (dbError) {
            console.error('[Profile Update] Supabase error:', dbError.message);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // 2. First-time EVM → award 100 XP (idempotent via xp_claims task_id).
        let awardedXp = 0;
        let newTotalXp = Number(existing?.total_xp || 0);
        let newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;
        if (isFirstEvm) {
            const { data: alreadyClaimed } = await supabase
                .from('xp_claims')
                .select('task_id')
                .eq('user_email', email)
                .eq('task_id', 'evm_address_added')
                .maybeSingle();

            if (!alreadyClaimed) {
                awardedXp = 100;
                newTotalXp += 100;
                newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;
                const [claimRes, updateRes] = await Promise.all([
                    supabase.from('xp_claims').insert({
                        user_email: email,
                        task_id: 'evm_address_added',
                        xp_amount: 100,
                    }),
                    supabase.from('profiles').update({
                        total_xp: newTotalXp,
                        level: newLevel,
                    }).eq('email', email),
                ]);
                if (claimRes.error || updateRes.error) {
                    console.error('[Profile Update] EVM XP award failed:', claimRes.error?.message || updateRes.error?.message);
                    awardedXp = 0; // didn't actually land — don't lie to the client
                }
            }
        }

        // 3. GHL sync (fire-and-forget — never block profile save).
        if (GHL_API_KEY && GHL_LOCATION_ID) {
            try {
                const searchRes = await fetch(
                    `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&query=${encodeURIComponent(email)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${GHL_API_KEY}`,
                            Version: '2021-07-28',
                            Accept: 'application/json',
                        },
                    }
                );
                const searchData = await searchRes.json();
                const contact = searchData.contacts?.[0];

                if (contact) {
                    const customFields: Array<{ id: string; field_value?: unknown; value?: unknown }> = [
                        { id: GHL_FIELD_SOCIALS, field_value: JSON.stringify(socials || {}) },
                    ];
                    if (evm_address) {
                        customFields.push({ id: GHL_FIELD_EVM, field_value: evm_address });
                    }
                    if (awardedXp > 0) {
                        customFields.push({ id: GHL_FIELD_TOTAL_XP, field_value: newTotalXp });
                        customFields.push({ id: GHL_FIELD_LEVEL, field_value: newLevel });
                    }
                    await fetch(`https://services.leadconnectorhq.com/contacts/${contact.id}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${GHL_API_KEY}`,
                            Version: '2021-07-28',
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({ customFields }),
                    });
                }
            } catch (ghlErr) {
                console.error('[Profile Update] GHL sync failed:', ghlErr);
            }
        }

        return NextResponse.json({ success: true, awardedXp, totalXp: newTotalXp });
    } catch (error: any) {
        console.error('[Profile Update] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
