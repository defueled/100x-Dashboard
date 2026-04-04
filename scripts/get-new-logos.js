const fs = require('fs');
const https = require('https');
const path = require('path');

const logosPath = path.join(__dirname, '../public/assets/logos');

const targets = [
    // Crypto/Web3
    { name: 'pepe', url: 'https://cryptologos.cc/logos/pepe-pepe-logo.png?v=025' },
    { name: 'metamask', url: 'https://cdn.simpleicons.org/metamask', ext: '.svg' },
    { name: 'rabby', url: 'https://raw.githubusercontent.com/nicehash/Cryptocurrency_Logos/refs/heads/main/128x128/pngs/Rabby.png' },
    // AI
    { name: 'claude', url: 'https://cdn.simpleicons.org/anthropic', ext: '.svg' },
    { name: 'xai', url: 'https://cdn.simpleicons.org/x', ext: '.svg' },
    { name: 'openclaw', url: 'https://cdn.simpleicons.org/openai', ext: '.svg' },
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
    console.log('Downloading new logos (Pepe, MetaMask, Rabby, Claude, XAI, OpenClaw)...');
    for (const t of targets) {
        const ext = t.ext || (t.url.includes('.png') ? '.png' : '.svg');
        const dest = path.join(logosPath, t.name + ext);
        try {
            await download(t.url, dest);
            console.log(`✅ Downloaded ${t.name}`);
        } catch (e) {
            console.error(`❌ Failed ${t.name}: ${e.message}`);
        }
    }
    console.log('Done!');
}

run();
