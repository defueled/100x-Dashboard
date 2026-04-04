/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const https = require('https');
const path = require('path');

const logosPath = path.join(__dirname, '../public/assets/logos');
if (!fs.existsSync(logosPath)) {
    fs.mkdirSync(logosPath, { recursive: true });
}

// Known URLs for clean SVGs/PNGs of the requested companies/coins
const targets = [
    // Crypto
    { name: 'bitcoin', url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025' },
    { name: 'ethereum', url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025' },
    { name: 'solana', url: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=025' },
    { name: 'binance', url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=025' },
    { name: 'xrp', url: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=025' },
    // Tech / AI
    { name: 'openai', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png' },
    { name: 'google', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png' },
    { name: 'microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png' },
    { name: 'tesla', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1024px-Tesla_Motors.svg.png' },
    { name: 'nvidia', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/1024px-Nvidia_logo.svg.png' },
    { name: 'apple', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1024px-Apple_logo_black.svg.png' },
    { name: 'meta', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1024px-Meta_Platforms_Inc._logo.svg.png' }
];

function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            // Handle redirects if necessary (rudimentary handling)
            if (res.statusCode === 301 || res.statusCode === 302) {
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
    console.log('Downloading logos...');
    for (const t of targets) {
        const ext = t.url.includes('.png') ? '.png' : '.svg';
        const dest = path.join(logosPath, t.name + ext);
        try {
            await download(t.url, dest);
            console.log(`Downloaded ${t.name}`);
        } catch (e) {
            console.error(`Failed ${t.name}: ${e.message}`);
        }
    }
}

run();
