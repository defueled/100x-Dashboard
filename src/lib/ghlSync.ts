/**
 * Fire-and-forget GHL Custom Fields sync.
 * Call after any gamification write — never awaited, never blocks response.
 *
 * Custom field IDs for location 7BzDyeAg6b6h8O2AK97O:
 *   total_xp           → ozhvo3NUTjUZqNatxJtx
 *   gm_streak          → OOSdAktiJzdOwYFkeCIt
 *   dashboard_level    → UYH1zSoZ2MHD0mYV0EZU
 *   display_name       → d1blBW1mkBLgScvWsUcy
 *   onboarding_complete→ e3l0bGYbwHfNTQIRIYdU
 *   skill_level        → mlnRSS5flJGWxPtmnHZt
 */

interface GHLSyncFields {
    total_xp?: number;
    gm_streak?: number;
    level?: number;
    display_name?: string;
    onboarding_complete?: boolean;
    skill_level?: string;
}

const FIELD_IDS: Record<keyof GHLSyncFields, string> = {
    total_xp: 'ozhvo3NUTjUZqNatxJtx',
    gm_streak: 'OOSdAktiJzdOwYFkeCIt',
    level: 'UYH1zSoZ2MHD0mYV0EZU',
    display_name: 'd1blBW1mkBLgScvWsUcy',
    onboarding_complete: 'e3l0bGYbwHfNTQIRIYdU',
    skill_level: 'mlnRSS5flJGWxPtmnHZt',
};

export async function syncUserToGHL(email: string, fields: GHLSyncFields): Promise<void> {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) return;

    try {
        // 1. Find contact by email
        const searchRes = await fetch(
            `https://services.leadconnectorhq.com/contacts/search?locationId=${locationId}&email=${encodeURIComponent(email)}&limit=1`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Version: '2021-07-28',
                    Accept: 'application/json',
                },
            }
        );

        if (!searchRes.ok) {
            console.warn('[GHLSync] Contact search failed:', searchRes.status);
            return;
        }

        const searchData = await searchRes.json();
        const contact = searchData.contacts?.[0];

        if (!contact?.id) {
            console.warn('[GHLSync] Contact not found for email:', email);
            return;
        }

        // 2. Build customFields array — only include keys that were passed
        const customFields = (Object.keys(fields) as Array<keyof GHLSyncFields>)
            .filter(k => fields[k] !== undefined)
            .map(k => ({
                id: FIELD_IDS[k],
                field_value: fields[k],
            }));

        if (customFields.length === 0) return;

        // 3. Update contact
        const updateRes = await fetch(
            `https://services.leadconnectorhq.com/contacts/${contact.id}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Version: '2021-07-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customFields }),
            }
        );

        if (!updateRes.ok) {
            const err = await updateRes.text();
            console.warn('[GHLSync] Update failed:', updateRes.status, err);
        }
    } catch (err) {
        console.warn('[GHLSync] Unexpected error:', err);
    }
}
