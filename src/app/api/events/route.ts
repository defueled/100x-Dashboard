import { NextResponse } from 'next/server';

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// 1-hour in-memory cache
let cache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000;

export async function GET() {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
        return NextResponse.json({ events: [] });
    }

    if (cache && Date.now() - cache.ts < CACHE_TTL) {
        return NextResponse.json({ events: cache.data });
    }

    try {
        const now = Date.now();
        const in30Days = now + 30 * 24 * 60 * 60 * 1000;

        const res = await fetch(
            `https://services.leadconnectorhq.com/calendars/events?locationId=${GHL_LOCATION_ID}&startTime=${now}&endTime=${in30Days}`,
            {
                headers: {
                    Authorization: `Bearer ${GHL_API_KEY}`,
                    Version: '2021-04-15',
                    Accept: 'application/json',
                },
                next: { revalidate: 3600 },
            }
        );

        if (!res.ok) {
            console.error('[Events API] GHL error:', res.status, await res.text());
            return NextResponse.json({ events: [] });
        }

        const data = await res.json();
        const events = (data.events || []).map((e: any) => ({
            id: e.id,
            title: e.title,
            start: e.startTime,
            end: e.endTime,
            calendarId: e.calendarId,
            appointmentStatus: e.appointmentStatus,
        }));

        cache = { data: events, ts: Date.now() };
        return NextResponse.json({ events });
    } catch (err) {
        console.error('[Events API] Fetch error:', err);
        return NextResponse.json({ events: [] });
    }
}
