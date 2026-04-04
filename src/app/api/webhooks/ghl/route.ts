import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Helper: Initialize Supabase with service role
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// Optional: Use a secret token to prevent unauthorized pings
const WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET || "default_local_secret";

export async function POST(req: Request) {
    try {
        // 1. Optional Security Check (Check if URL contains the secret like ?token=xyz)
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (process.env.NODE_ENV === "production" && token !== WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse the GHL Webhook Payload
        // GoHighLevel Workflows typically send JSON body with contact info
        const body = await req.json();

        // GHL usually sends email at body.email or inside body.contact.email
        const email = body.email || body.contact?.email;

        if (!email) {
            return NextResponse.json({ error: "No email provided in webhook payload" }, { status: 400 });
        }

        console.log(`[GHL Webhook] Received subscription event for: ${email}`);

        const supabase = getSupabase();

        // 3. Update the user in Supabase!
        const { data, error } = await supabase
            .from("profiles")
            .update({ is_subscribed: true })
            .eq("email", email)
            .select();

        if (error) {
            console.error("[GHL Webhook] Error updating Supabase:", error);
            return NextResponse.json({ error: "Database update failed" }, { status: 500 });
        }

        if (!data || data.length === 0) {
            console.warn(`[GHL Webhook] Note: Email ${email} not found in Supabase yet. They need to login first.`);
            // You could alternatively do an UPSERT here if you want to create the profile early, 
            // but usually we wait for Google Auth to create the auth.users record first.
            return NextResponse.json({ message: "Success, but user profile does not exist yet.", email }, { status: 200 });
        }

        console.log(`[GHL Webhook] Successfully granted dashboard access to: ${email}`);
        return NextResponse.json({ message: "Subscription granted", email }, { status: 200 });

    } catch (err) {
        console.error("[GHL Webhook] Fatal Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
