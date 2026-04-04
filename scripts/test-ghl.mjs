async function testGHL() {
    const apiKey = "pit-d3e16e08-33f5-4702-8a13-f4c1ad8bec5a";

    console.log("Testing V2 API Get Location...");

    try {
        // There is typically an endpoint like /users or /locations?companyId=...
        // Let's try /contacts with a random locationId to see if it overrides or if we just get 422
        // Wait, let's try GET /locations  (if it is a company-level key)
        const response = await fetch('https://services.leadconnectorhq.com/locations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Version': '2021-07-28',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        console.log("V2 Locations Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("V2 Error:", e);
    }
}

testGHL();
