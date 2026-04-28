import { createClient } from '@supabase/supabase-js';

export const ADMIN_GHL_TAG = 'admin👑';

/**
 * Admin allow-list. Set ADMIN_EMAILS in Vercel as a comma-separated list.
 * e.g. ADMIN_EMAILS="arturs@example.com,lelde@example.com"
 *
 * This is the SYNC, env-only check. For the canonical admin gate that also
 * recognises GHL `admin👑` tag owners, use {@link isAdmin} (async).
 */
export function isAdminEmail(email: string | undefined | null): boolean {
    if (!email) return false;
    const raw = process.env.ADMIN_EMAILS || '';
    const allowed = raw
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    return allowed.includes(email.toLowerCase());
}

/**
 * Canonical admin check: env list OR GHL `admin👑` tag stored on profile.
 * Use this in API routes that gate admin actions.
 */
export async function isAdmin(email: string | undefined | null): Promise<boolean> {
    if (!email) return false;
    if (isAdminEmail(email)) return true;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return false;

    try {
        const supabase = createClient(url, key);
        const { data } = await supabase
            .from('profiles')
            .select('socials')
            .eq('email', email)
            .maybeSingle();

        const tags: string[] = data?.socials?.ghl_tags || [];
        return tags.some((t) => t.toLowerCase().trim() === ADMIN_GHL_TAG);
    } catch {
        return false;
    }
}
