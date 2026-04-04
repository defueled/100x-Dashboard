const fs = require('fs');
const https = require('https');
const path = require('path');

const logosPath = path.join(__dirname, '../public/assets/logos');

const targets = [
    // Icon-only NVIDIA
    { name: 'nvidia', url: 'https://cdn.simpleicons.org/nvidia' },

    // More unique brands
    { name: 'tesla', url: 'https://cdn.simpleicons.org/tesla' },
    { name: 'spacex', url: 'https://cdn.simpleicons.org/spacex' },
    { name: 'microsoft', url: 'https://cdn.simpleicons.org/microsoft' },
    { name: 'apple', url: 'https://cdn.simpleicons.org/apple' },
    { name: 'google', url: 'https://cdn.simpleicons.org/google' },
    { name: 'amazon', url: 'https://cdn.simpleicons.org/amazon' },
    { name: 'netflix', url: 'https://cdn.simpleicons.org/netflix' },
    { name: 'disney', url: 'https://cdn.simpleicons.org/disney' },
    { name: 'nike', url: 'https://cdn.simpleicons.org/nike' },
    { name: 'adidas', url: 'https://cdn.simpleicons.org/adidas' },
    { name: 'visa', url: 'https://cdn.simpleicons.org/visa' },
    { name: 'mastercard', url: 'https://cdn.simpleicons.org/mastercard' },
    { name: 'americanexpress', url: 'https://cdn.simpleicons.org/americanexpress' },
    { name: 'paypal', url: 'https://cdn.simpleicons.org/paypal' },
    { name: 'visa', url: 'https://cdn.simpleicons.org/visa' },
    { name: 'samsung', url: 'https://cdn.simpleicons.org/samsung' },
    { name: 'sony', url: 'https://cdn.simpleicons.org/sony' },
    { name: 'nintendo', url: 'https://cdn.simpleicons.org/nintendo' },
    { name: 'twitch', url: 'https://cdn.simpleicons.org/twitch' },
    { name: 'youtube', url: 'https://cdn.simpleicons.org/youtube' },
    { name: 'instagram', url: 'https://cdn.simpleicons.org/instagram' },
    { name: 'tiktok', url: 'https://cdn.simpleicons.org/tiktok' },
    { name: 'whatsapp', url: 'https://cdn.simpleicons.org/whatsapp' },
    { name: 'telegram', url: 'https://cdn.simpleicons.org/telegram' },
    { name: 'signal', url: 'https://cdn.simpleicons.org/signal' },
    { name: 'uber', url: 'https://cdn.simpleicons.org/uber' },
    { name: 'airbnb', url: 'https://cdn.simpleicons.org/airbnb' },
    { name: 'spotify', url: 'https://cdn.simpleicons.org/spotify' },
    { name: 'shopify', url: 'https://cdn.simpleicons.org/shopify' }
];

function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
                return download(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    console.log('Fetching diverse logo set...');
    for (const t of targets) {
        const dest = path.join(logosPath, t.name + '.png');
        // We try to get them as PNG if possible, or convert? SimpleIcons serves SVGs. 
        // For now, let's just get more SVGs and ensure generator handles them.
        const svgDest = path.join(logosPath, t.name + '.svg');
        try {
            await download(t.url, svgDest);
            console.log(`Downloaded ${t.name}`);
        } catch (e) {
            console.error(`Failed ${t.name}: ${e.message}`);
        }
    }
}
run();
