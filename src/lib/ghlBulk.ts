import { createClient } from '@supabase/supabase-js';
import { getGhlLevelFromTags } from './ghlLevels';

const GHL_ENDPOINT = 'https://services.leadconnectorhq.com/contacts/search';
const GHL_VERSION = '2021-07-28';
const SUB_TAG = 'abonements💰';
const PAGE_SIZE = 100;

interface GHLContact {
    id: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    tags?: string[];
    customFields?: Array<{ id: string; value?: string | number | null; fieldValue?: string | number | null }>;
}

interface SyncOptions {
    maxPages?: number; // safety cap; default 50 (5000 contacts)
}

export interface SyncResult {
    synced: number;
    skipped: number;
    errors: string[];
    pages: number;
}

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

function readCustomField(contact: GHLContact, fieldId?: string): number {
    if (!fieldId) return 0;
    const field = contact.customFields?.find((f) => f.id === fieldId);
    if (!field) return 0;
    const raw = field.value ?? field.fieldValue;
    const n = Number(raw);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}

async function fetchPage(page: number): Promise<GHLContact[]> {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    if (!apiKey || !locationId) {
        throw new Error('GHL_API_KEY or GHL_LOCATION_ID not set');
    }

    const res = await fetch(GHL_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            Version: GHL_VERSION,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            locationId,
            page,
            pageLimit: PAGE_SIZE,
            filters: [{ field: 'tags', operator: 'contains', value: SUB_TAG }],
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GHL search failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    return (data.contacts as GHLContact[]) || [];
}

export async function bulkSyncGhlSubscribers(opts: SyncOptions = {}): Promise<SyncResult> {
    const maxPages = opts.maxPages ?? 50;
    const supabase = getSupabase();

    const AI_ID = process.env.GHL_FIELD_AI_PROGRESS;
    const DEFI_ID = process.env.GHL_FIELD_DEFI_PROGRESS;
    const TRADFI_ID = process.env.GHL_FIELD_TRADFI_PROGRESS;
    const CULTURE_ID = process.env.GHL_FIELD_CULTURE_PROGRESS;

    const result: SyncResult = { synced: 0, skipped: 0, errors: [], pages: 0 };
    const now = new Date().toISOString();

    for (let page = 1; page <= maxPages; page++) {
        let contacts: GHLContact[];
        try {
            contacts = await fetchPage(page);
        } catch (e) {
            result.errors.push(e instanceof Error ? e.message : String(e));
            break;
        }

        if (contacts.length === 0) break;
        result.pages = page;

        for (const c of contacts) {
            const email = c.email?.toLowerCase().trim();
            if (!email) {
                result.skipped++;
                continue;
            }

            const ghlLevel = getGhlLevelFromTags(c.tags || []);
            const aiProgress = readCustomField(c, AI_ID);
            const defiProgress = readCustomField(c, DEFI_ID);
            const tradfiProgress = readCustomField(c, TRADFI_ID);
            const cultureProgress = readCustomField(c, CULTURE_ID);

            const { error } = await supabase
                .from('profiles')
                .update({
                    ghl_level: ghlLevel,
                    ghl_level_synced_at: now,
                    ai_progress: aiProgress,
                    defi_progress: defiProgress,
                    tradfi_progress: tradfiProgress,
                    culture_progress: cultureProgress,
                    is_subscribed: true,
                })
                .eq('email', email);

            if (error) {
                result.errors.push(`${email}: ${error.message}`);
            } else {
                result.synced++;
            }
        }

        if (contacts.length < PAGE_SIZE) break;
    }

    return result;
}
