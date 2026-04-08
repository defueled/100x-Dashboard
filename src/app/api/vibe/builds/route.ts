import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('vibe_builds')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('[Vibe Builds GET]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
