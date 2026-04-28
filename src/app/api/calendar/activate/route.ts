import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key);
}

const KNOWN_PRODUCTS = new Set([
    '100x-forum',
    'ai-fast-track',
    'defi-dca',
    'burnout-shield',
]);
const LOCKED_PRODUCTS = new Set(['defi-dca', 'burnout-shield']);

async function tagGhlContact(email: string, productId: string) {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    if (!apiKey || !locationId) return;
    try {
        const search = await fetch('https://services.leadconnectorhq.com/contacts/search', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Version: '2021-07-28',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ locationId, page: 1, pageLimit: 1, query: email }),
        });
        const data = await search.json();
        const contactId = data?.contacts?.[0]?.id;
        if (!contactId) return;
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Version: '2021-07-28',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ tags: [`calendar-${productId}`] }),
        });
    } catch (err) {
        console.error('[calendar/activate] GHL tag error:', err);
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const productId = String(body?.productId || '').trim();

    if (!KNOWN_PRODUCTS.has(productId)) {
        return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
    }
    if (LOCKED_PRODUCTS.has(productId)) {
        return NextResponse.json({ error: 'Locked tier — abonement required' }, { status: 403 });
    }

    const supabase = getSupabase();
    const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('calendar_overlays')
        .eq('email', email)
        .maybeSingle();

    if (profileErr) {
        return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    const current: string[] = Array.isArray(profile?.calendar_overlays)
        ? profile!.calendar_overlays
        : [];
    if (current.includes(productId)) {
        return NextResponse.json({ success: true, calendarOverlays: current, alreadyActive: true });
    }
    const next = [...current, productId];

    const { error: upErr } = await supabase
        .from('profiles')
        .update({ calendar_overlays: next })
        .eq('email', email);

    if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    tagGhlContact(email, productId).catch(() => {});

    return NextResponse.json({ success: true, calendarOverlays: next });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = String(searchParams.get('productId') || '').trim();
    if (!KNOWN_PRODUCTS.has(productId)) {
        return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('calendar_overlays')
        .eq('email', email)
        .maybeSingle();

    if (profileErr) {
        return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    const current: string[] = Array.isArray(profile?.calendar_overlays)
        ? profile!.calendar_overlays
        : [];
    const next = current.filter((p) => p !== productId);

    const { error: upErr } = await supabase
        .from('profiles')
        .update({ calendar_overlays: next })
        .eq('email', email);

    if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, calendarOverlays: next });
}
