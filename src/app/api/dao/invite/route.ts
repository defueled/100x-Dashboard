import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createHmac } from 'crypto';
import { authOptions } from '@/lib/authOptions';
import { getGhlLevelFromTags } from '@/lib/ghlLevels';

export async function POST(_req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = session.user as {
            id?: string;
            email?: string | null;
            ghl_tags?: string[];
        };

        const ghlTags: string[] = user.ghl_tags ?? [];
        const level = getGhlLevelFromTags(ghlTags);

        if (level < 4) {
            return NextResponse.json(
                { error: 'Nepieciešams GHL Lvl 4+' },
                { status: 403 }
            );
        }

        const secret = process.env.NEXTAUTH_SECRET;
        const botUsername = process.env.TELEGRAM_BOT_USERNAME;

        if (!secret || !botUsername) {
            console.error('[dao/invite] Missing NEXTAUTH_SECRET or TELEGRAM_BOT_USERNAME');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        const userId = user.id ?? user.email ?? 'unknown';
        const timestamp = Date.now();

        const hmac = createHmac('sha256', secret)
            .update(`${userId}:${timestamp}`)
            .digest('hex');

        const token = `${userId}.${timestamp}.${hmac}`;
        const deepLink = `https://t.me/${botUsername}?start=${token}`;

        return NextResponse.json({ deepLink });
    } catch (error: unknown) {
        console.error('[dao/invite] Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
