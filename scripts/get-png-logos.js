const fs = require('fs');
const https = require('https');
const path = require('path');

const logosPath = path.join(__dirname, '../public/assets/logos');

const domains = [
    'visa.com', 'mastercard.com', 'paypal.com', 'stripe.com', 'revolut.com', 'wise.com',
    'tesla.com', 'spacex.com', 'apple.com', 'amazon.com', 'netflix.com', 'spotify.com',
    'uber.com', 'airbnb.com', 'meta.com', 'x.com', 'discord.com', 'slack.com', 'zoom.us',
    'microsoft.com', 'google.com', 'adobe.com', 'salesforce.com', 'oracle.com', 'ibm.com',
    'intel.com', 'amd.com', 'nvidia.com', 'samsung.com', 'sonymusic.com', 'nike.com',
    'adidas.com', 'starbucks.com', 'mcdonalds.com', 'cocacola.com', 'pepsi.com',
    'binance.com', 'coinbase.com', 'kraken.com', 'robinhood.com', 'fidelity.com',
    'blackrock.com', 'vanguard.com', 'goldmansachs.com', 'jpmorganchase.com'
];

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, { timeout: 5000 }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
                return download(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
        });
        request.on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function run() {
    console.log('Fetching 40+ unique PNG logos...');
    for (const domain of domains) {
        const name = domain.split('.')[0];
        const dest = path.join(logosPath, name + '.png');
        // Using a more reliable PNG API or fallback
        const url = `https://logo.clearbit.com/${domain}`;
        try {
            await download(url, dest);
            console.log(`Downloaded ${name}`);
        } catch (e) {
            // Fallback to google favicon if clearbit fails
            const fallbackUrl = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
            try {
                await download(fallbackUrl, dest);
                console.log(`Downloaded ${name} (fallback)`);
            } catch (e2) {
                console.error(`Failed ${name}: ${e2.message}`);
            }
        }
    }
}
run();
