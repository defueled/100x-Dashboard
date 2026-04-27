import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';
import { isAdminEmail } from '@/lib/admin';

// Helper: Initialize Supabase lazily
function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error('❌ [NextAuth] Supabase environment variables are missing!');
        return null;
    }
    try {
        return createClient(url, key);
    } catch (err) {
        console.error('❌ [NextAuth] Failed to initialize Supabase client:', err);
        return null;
    }
}

const GHL_API_KEY = process.env.GHL_API_KEY!;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID!;
const GHL_SUB_TAG = 'abonements💰';
const GHL_DASHBOARD_TAG = 'pieeja-dashboard';

async function getGHLContactByEmail(email: string) {
    console.log(`[NextAuth GHL] Fetching contact for email: ${email}`);
    if (!GHL_API_KEY || !GHL_LOCATION_ID) return null;
    try {
        let res = await fetch(`https://services.leadconnectorhq.com/contacts/search`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GHL_API_KEY}`,
                Version: '2021-07-28',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ locationId: GHL_LOCATION_ID, page: 1, pageLimit: 5, query: email }),
        });
        let data = await res.json();

        if (!data.contacts || data.contacts.length === 0) {
            const prefix = email.split('@')[0];
            res = await fetch(`https://services.leadconnectorhq.com/contacts/search`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${GHL_API_KEY}`,
                    Version: '2021-07-28',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ locationId: GHL_LOCATION_ID, page: 1, pageLimit: 10, query: prefix }),
            });
            data = await res.json();
        }

        if (data?.contacts?.length > 0) {
            const contacts = data.contacts as any[];
            const bestMatch = contacts.find(
                (c) =>
                    c.email?.toLowerCase() === email.toLowerCase() ||
                    c.additionalEmails?.some((e: any) => e.email?.toLowerCase() === email.toLowerCase())
            );
            if (bestMatch) return bestMatch;

            const targetSubTag = GHL_SUB_TAG.toLowerCase().trim();
            const subscriber = contacts.find((c) =>
                (c.tags || []).some((t: string) => t.toLowerCase().trim() === targetSubTag)
            );
            if (subscriber) return subscriber;
        }
        return null;
    } catch (error) {
        console.error('[NextAuth GHL] Error:', error);
        return null;
    }
}

async function upsertGHLContact(email: string, name?: string | null) {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) return null;
    try {
        const [firstName, ...rest] = (name || '').split(' ');
        const res = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GHL_API_KEY}`,
                Version: '2021-07-28',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                email,
                firstName: firstName || undefined,
                lastName: rest.join(' ') || undefined,
                locationId: GHL_LOCATION_ID,
                tags: [GHL_DASHBOARD_TAG, 'dashboard-signup'],
                source: '100x-dashboard',
            }),
        });
        if (!res.ok) {
            console.error('[NextAuth GHL] Upsert failed:', await res.text());
            return null;
        }
        const data = await res.json();
        console.log('[NextAuth GHL] Contact upserted:', data.contact?.id);
        return data.contact ?? null;
    } catch (error) {
        console.error('[NextAuth GHL] Upsert error:', error);
        return null;
    }
}

async function addGHLTag(contactId: string, tag: string) {
    try {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GHL_API_KEY}`,
                Version: '2021-07-28',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ tags: [tag] }),
        });
    } catch (error) {
        console.error(`GHL Add Tag (${tag}) Error:`, error);
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            httpOptions: { timeout: 10000 },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google' && user.email) {
                try {
                    const supabase = getSupabase();
                    if (!supabase) {
                        console.error('❌ [NextAuth] Supabase client is null — profile sync skipped');
                        return true; // Still let the user in
                    }

                    // GHL sync (fire-and-forget, never blocks login)
                    let ghlContact = await getGHLContactByEmail(user.email).catch(() => null);
                    let userGhlTags: string[] = [];

                    if (!ghlContact) {
                        ghlContact = await upsertGHLContact(user.email, user.name).catch(() => null);
                    }

                    let ghlEvmFromCrm: string | null = null;
                    if (ghlContact) {
                        const tags = ghlContact.tags || [];
                        userGhlTags = tags;
                        const normalizedTags = tags.map((t: string) => t.toLowerCase().trim());
                        if (!normalizedTags.includes(GHL_DASHBOARD_TAG.toLowerCase().trim())) {
                            addGHLTag(ghlContact.id, GHL_DASHBOARD_TAG).catch(() => {});
                        }
                        // Pull EVM adrese from CRM if present so we can seed the profile.
                        const evmField = (ghlContact.customFields || []).find(
                            (f: any) => f.id === 'DwkIM1fCcBTwQy3nKVsW'
                        );
                        const rawEvm = (evmField?.value ?? evmField?.fieldValue ?? '').toString().trim();
                        if (/^0x[0-9a-fA-F]{40}$/.test(rawEvm)) {
                            ghlEvmFromCrm = rawEvm;
                        }
                    }

                    // Abonements💰 gate: only paid subscribers get full access.
                    const isSubscriber = userGhlTags.some(
                        (t: string) => t.toLowerCase().trim() === GHL_SUB_TAG.toLowerCase().trim()
                    );

                    const { data: existingProfile } = await supabase
                        .from('profiles')
                        .select('socials, referral_code, evm_address, total_xp')
                        .eq('email', user.email)
                        .single();

                    const newSocials = {
                        ...(existingProfile?.socials || {}),
                        ghl_tags: userGhlTags,
                    };
                    const referralCode = existingProfile?.referral_code ||
                        Math.random().toString(36).substring(2, 8).toUpperCase();

                    // If GHL has an EVM and the profile doesn't, seed it in and award
                    // the one-time 100 XP (idempotent via xp_claims 'evm_address_added').
                    const shouldSeedEvm = Boolean(
                        ghlEvmFromCrm && !existingProfile?.evm_address
                    );
                    let seededTotalXp: number | undefined;
                    let seededLevel: number | undefined;
                    if (shouldSeedEvm) {
                        const { data: alreadyClaimed } = await supabase
                            .from('xp_claims')
                            .select('task_id')
                            .eq('user_email', user.email)
                            .eq('task_id', 'evm_address_added')
                            .maybeSingle();
                        if (!alreadyClaimed) {
                            const base = Number(existingProfile?.total_xp || 0);
                            seededTotalXp = base + 100;
                            seededLevel = Math.floor(Math.sqrt(seededTotalXp / 100)) + 1;
                            await supabase.from('xp_claims').insert({
                                user_email: user.email,
                                task_id: 'evm_address_added',
                                xp_amount: 100,
                            });
                        }
                    }

                    const { error } = await supabase.from('profiles').upsert(
                        {
                            id: user.id,
                            email: user.email,
                            full_name: user.name,
                            avatar_url: user.image,
                            is_subscribed: isSubscriber,
                            socials: newSocials,
                            referral_code: referralCode,
                            ...(shouldSeedEvm ? { evm_address: ghlEvmFromCrm } : {}),
                            ...(seededTotalXp !== undefined ? { total_xp: seededTotalXp, level: seededLevel } : {}),
                        },
                        { onConflict: 'email' }
                    );

                    if (error) {
                        console.error('⚠️ [NextAuth] Profile upsert failed:', error.message);
                        // Don't block login — profile will be created on next visit
                    }
                } catch (err) {
                    console.error('⚠️ [NextAuth] signIn callback error:', err);
                    // Never block login because of backend sync failures
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                const supabase = getSupabase();
                // @ts-ignore
                session.user.id = token.sub;

                if (!supabase) return session;

                const { data } = await supabase
                    .from('profiles')
                    .select('is_subscribed, socials')
                    .eq('email', session.user.email)
                    .single();

                if (data) {
                    // @ts-ignore
                    session.user.is_subscribed = data.is_subscribed;
                    // @ts-ignore
                    session.user.ghl_tags = data.socials?.ghl_tags || [];
                }
                // Admin allow-list bypass — resolved server-side from ADMIN_EMAILS env.
                // @ts-ignore
                session.user.is_admin = isAdminEmail(session.user.email);
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
