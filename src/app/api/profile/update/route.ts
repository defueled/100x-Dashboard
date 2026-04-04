import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// Specific GHL Field IDs found in research
const FIELDS = {
    SOCIALS: 'oGcIVxfZ8irbsepc4xVj', // Sociālo mēdiju saites
    EVM_ADDRESS: 'contact.evm_address', // Placeholder - will attempt to update by key
    DESCRIPTION: 'contact.profile_description'
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { evm_address, profile_description, socials } = await req.json();

        // 1. Search for contact in GHL
        const searchUrl = `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION_ID}&query=${session.user.email}`;
        const searchRes = await fetch(searchUrl, {
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': '2021-07-28',
                'Accept': 'application/json'
            }
        });

        const searchData = await searchRes.json();
        const contact = searchData.contacts?.[0];

        if (!contact) {
            return NextResponse.json({ error: 'GHL Contact not found' }, { status: 404 });
        }

        // 2. Update GHL Contact
        const updateUrl = `https://services.leadconnectorhq.com/contacts/${contact.id}`;
        const updateBody = {
            customFields: [
                { id: FIELDS.SOCIALS, value: JSON.stringify(socials) },
                { id: FIELDS.EVM_ADDRESS, value: evm_address },
                { id: FIELDS.DESCRIPTION, value: profile_description }
            ]
        };

        const updateRes = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updateBody)
        });

        if (!updateRes.ok) {
            const errorText = await updateRes.text();
            console.error('[GHL Sync Error]:', errorText);
            // We return 200 even if GHL fails if we want the dashboard to feel fast, 
            // but for reliability let's throw.
            throw new Error('Failed to update GHL contact');
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("[Profile Sync Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
