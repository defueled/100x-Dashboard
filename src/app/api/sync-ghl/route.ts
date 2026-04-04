import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, questId, progress, xp } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const GHL_API_KEY = process.env.GHL_API_KEY;
        const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

        if (!GHL_API_KEY) {
            console.warn('GHL_API_KEY is not set. Skipping sync.');
            return NextResponse.json({ message: 'Sync skipped (no API key)' });
        }

        // 1. Find or Upsert Contact in GHL
        // Documentation: https://highlevel.stoplight.io/docs/integrations/00926d913bc61-upsert-contact
        const response = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                locationId: GHL_LOCATION_ID,
                tags: [`ai_quest_${questId}`, `xp_${xp}`],
                customFields: [
                    { key: 'ai_quest_progress', value: `${questId}: ${progress}%` },
                    { key: 'total_xp', value: xp }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('GHL Sync Error:', error);
            return NextResponse.json({ error: 'Failed to sync with GHL' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Successfully synced with GHL' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
