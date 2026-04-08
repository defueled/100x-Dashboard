import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code: rawCode } = await params;
    const code = rawCode?.toUpperCase().trim();
    if (!code || !/^[A-Z0-9]{4,10}$/.test(code)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    const res = NextResponse.redirect(new URL('/', req.url));
    // Store ref code for 30 days — processed after signup in /api/referral/process
    res.cookies.set('ref_code', code, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
    });
    return res;
}
