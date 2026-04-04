import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://nrccirllzbkuncprafsf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yY2NpcmxsemJrdW5jcHJhZnNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ2NzE0MiwiZXhwIjoyMDg4MDQzMTQyfQ.Y54TXwdEoB0HMaUSKQuJT7_h-woKLcHHE56cs0v_4CI"
);

const GHL_API_KEY = "pit-fb18f5c5-a2a2-425f-af2b-db4f15476e80";
const GHL_LOCATION_ID = "7BzDyeAg6b6h8O2AK97O";

async function diagnoseTags() {
    console.log("1. Fetching most recent user from Supabase...");
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error || !profiles || profiles.length === 0) {
        console.error("No profiles found!", error);
        return;
    }

    const email = profiles[0].email;
    console.log(`✅ Found recent login: ${email}`);

    console.log(`\n2. Searching GHL Contacts for ${email}...`);
    try {
        const res = await fetch(`https://services.leadconnectorhq.com/contacts/search`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GHL_API_KEY}`,
                "Version": "2021-07-28",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                locationId: GHL_LOCATION_ID,
                page: 1,
                pageLimit: 1,
                query: email
            })
        });

        const data = await res.json();

        if (data && data.contacts && data.contacts.length > 0) {
            const contact = data.contacts[0];
            console.log("\n✅ Contact Found:");
            console.log("Name:", contact.fullName || contact.firstName);
            console.log("Tags:", contact.tags);

            const targetTag = "abonements💰";
            if (contact.tags && contact.tags.includes(targetTag)) {
                console.log(`\n🎉 PERFECT MATCH! Contact has exactly '${targetTag}'`);
            } else {
                console.log(`\n❌ MISMATCH! Contact does NOT have exactly '${targetTag}'`);
                console.log("Here are the exact tag characters (might be an invisible space/encoding issue):");
                if (contact.tags) {
                    contact.tags.forEach(t => console.log(`Tag: "${t}" | Length: ${t.length} | Target Length: ${targetTag.length}`));
                }
            }
        } else {
            console.log("❌ No contacts found with that email in GHL!");
            console.log("Raw Response Data:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Test Error:", e);
    }
}

diagnoseTags();
