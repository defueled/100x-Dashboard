const fs = require('fs');
const https = require('https');
const path = require('path');

const logosPath = path.join(__dirname, '../public/assets/logos');

const targets = [
    // AI / Tech
    { name: 'anthropic', url: 'https://cdn.simpleicons.org/anthropic/white/59b687' },
    { name: 'meta', url: 'https://cdn.simpleicons.org/meta' },
    { name: 'ibm', url: 'https://cdn.simpleicons.org/ibm' },
    { name: 'intel', url: 'https://cdn.simpleicons.org/intel' },
    { name: 'amd', url: 'https://cdn.simpleicons.org/amd' },
    { name: 'oracle', url: 'https://cdn.simpleicons.org/oracle' },
    { name: 'salesforce', url: 'https://cdn.simpleicons.org/salesforce' },
    { name: 'adobe', url: 'https://cdn.simpleicons.org/adobe' },
    { name: 'spotify', url: 'https://cdn.simpleicons.org/spotify' },
    { name: 'uber', url: 'https://cdn.simpleicons.org/uber' },
    { name: 'airbnb', url: 'https://cdn.simpleicons.org/airbnb' },
    { name: 'slack', url: 'https://cdn.simpleicons.org/slack' },
    { name: 'zoom', url: 'https://cdn.simpleicons.org/zoom' },
    { name: 'stripe', url: 'https://cdn.simpleicons.org/stripe' },
    { name: 'coinbase', url: 'https://cdn.simpleicons.org/coinbase' },
    { name: 'revolut', url: 'https://cdn.simpleicons.org/revolut' },
    { name: 'wise', url: 'https://cdn.simpleicons.org/wise' },
    { name: 'notion', url: 'https://cdn.simpleicons.org/notion' },
    { name: 'figma', url: 'https://cdn.simpleicons.org/figma' },
    { name: 'github', url: 'https://cdn.simpleicons.org/github' },
    { name: 'discord', url: 'https://cdn.simpleicons.org/discord' }
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
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    console.log('Fetching more unique tech logos as PNG-compatible content...');
    for (const t of targets) {
        // Note: SimpleIcons returns SVG by default. Canvas loadImage handles SVGs on many systems, 
        // but if not, we might need PNGs. SimpleIcons doesn't easily serve PNGs via CDN.
        // However, node-canvas (which generate-sequence uses) usually handles SVGs if librsvg is installed.
        const dest = path.join(logosPath, t.name + '.svg');
        try {
            await download(t.url, dest);
            console.log(`Downloaded ${t.name}`);
        } catch (e) {
            console.error(`Failed ${t.name}: ${e.message}`);
        }
    }
}

run();
