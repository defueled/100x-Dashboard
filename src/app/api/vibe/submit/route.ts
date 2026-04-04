import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { authOptions } from '@/lib/authOptions';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VIBE_BUILD_XP = 250;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description, url, tools, sprint_id = 'sprint_1' } = await req.json();

        if (!title || !url) {
            return NextResponse.json({ error: 'title and url are required' }, { status: 400 });
        }

        // Check if user already submitted for this sprint
        const { data: existing } = await supabase
            .from('vibe_builds')
            .select('id')
            .eq('user_email', session.user.email)
            .eq('sprint_id', sprint_id)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Jau iesniegts šajā sprintā. Katram sprintam ir viens iesniegums.' },
                { status: 409 }
            );
        }

        // Insert build
        const { error: insertError } = await supabase
            .from('vibe_builds')
            .insert({
                user_email: session.user.email,
                user_name: session.user.name,
                user_avatar: session.user.image,
                title,
                description,
                url,
                tools: tools || [],
                sprint_id,
            });

        if (insertError) throw insertError;

        // Award XP via user_progress upsert
        const questId = `vibe_${sprint_id}_build`;
        await supabase.from('user_progress').upsert({
            user_email: session.user.email,
            quest_id: questId,
            xp_earned: VIBE_BUILD_XP,
            progress: 100,
            status: 'completed',
            updated_at: new Date().toISOString(),
        });

        // Update profile total_xp
        const { data: profile } = await supabase
            .from('profiles')
            .select('total_xp')
            .eq('email', session.user.email)
            .single();

        if (profile) {
            await supabase
                .from('profiles')
                .update({ total_xp: (Number(profile.total_xp) || 0) + VIBE_BUILD_XP })
                .eq('email', session.user.email);
        }

        // Tag in GHL (fire-and-forget)
        const ghlApiKey = process.env.GHL_API_KEY;
        const ghlLocationId = process.env.GHL_LOCATION_ID;
        if (ghlApiKey && ghlLocationId) {
            fetch(`https://services.leadconnectorhq.com/contacts/upsert`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${ghlApiKey}`,
                    'Content-Type': 'application/json',
                    Version: '2021-07-28',
                },
                body: JSON.stringify({
                    locationId: ghlLocationId,
                    email: session.user.email,
                    tags: [`vibe_builder_${sprint_id}`],
                }),
            }).catch(err => console.error('[Vibe GHL tag error]:', err));
        }

        return NextResponse.json({ success: true, xpAwarded: VIBE_BUILD_XP });
    } catch (error: any) {
        console.error('[Vibe Submit POST]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
