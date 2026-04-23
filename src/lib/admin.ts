/**
 * Admin allow-list. Set ADMIN_EMAILS in Vercel as a comma-separated list.
 * e.g. ADMIN_EMAILS="arturs@example.com,lelde@example.com"
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
