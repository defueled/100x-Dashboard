import { NextRequest, NextResponse } from 'next/server';
import { getMintinsBalance } from '@/lib/mintins';

export async function GET(req: NextRequest): Promise<NextResponse> {
    const address = req.nextUrl.searchParams.get('address');
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
        return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }
    const balance = await getMintinsBalance(address);
    if (balance === null) {
        return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 502 });
    }
    return NextResponse.json({ balance });
}
