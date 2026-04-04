import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://nrccirllzbkuncprafsf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yY2NpcmxsemJrdW5jcHJhZnNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ2NzE0MiwiZXhwIjoyMDg4MDQzMTQyfQ.Y54TXwdEoB0HMaUSKQuJT7_h-woKLcHHE56cs0v_4CI"
);

async function testSupabase() {
    console.log("Testing Supabase Upsert...");

    // Simulating a NextAuth user object
    const { error } = await supabase.from('profiles').upsert({
        id: "12345678-1234-1234-1234-123456789012", // UUID required by Supabase auth
        email: "test_insert@example.com",
        full_name: "Test User",
        avatar_url: "https://example.com/avatar.png",
        is_subscribed: false
    }, { onConflict: 'email' });

    if (error) {
        console.error("Supabase Error:", error);
    } else {
        console.log("Supabase Insert Success!");
    }
}

testSupabase();
