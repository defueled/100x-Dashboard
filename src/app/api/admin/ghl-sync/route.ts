import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { bulkSyncGhlSubscribers } from '@/lib/ghlBulk';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function isAuthorized(req: Request): boolean {
    const secret = process.env.CRON_SECRET;
    if (!secret) return false;
    const header = req.headers.get('x-cron-secret') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    return header === secret;
}

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

export async function POST(req: Request) {
    if (!isAuthorized(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const started = Date.now();
    try {
        const result = await bulkSyncGhlSubscribers();
        return NextResponse.json({ ...result, ms: Date.now() - started });
    } catch (e) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : String(e), ms: Date.now() - started },
            { status: 500 }
        );
    }
}

// Vercel Cron sends GET by default. Accept both.
export async function GET(req: Request) {
    const url = new URL(req.url);

    // Admin read-only view: ?list=1
    if (url.searchParams.get('list') === '1') {
        if (!isAuthorized(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('profiles')
            .select('email, display_name, ghl_level, ai_progress, defi_progress, tradfi_progress, culture_progress, ghl_level_synced_at, is_subscribed')
            .eq('is_subscribed', true)
            .order('ghl_level', { ascending: false })
            .limit(500);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ count: data?.length ?? 0, rows: data ?? [] });
    }

    // Cron trigger: GET with secret header.
    return POST(req);
}
