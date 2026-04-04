const fs = require('fs');
const https = require('https');
const path = require('path');

const logosPath = path.join(__dirname, '../public/assets/logos');

const targets = [
    // Crypto
    { name: 'avax', url: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=025' },
    { name: 'ada', url: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=025' },
    { name: 'dot', url: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png?v=025' },
    { name: 'link', url: 'https://cryptologos.cc/logos/chainlink-link-logo.png?v=025' },
    { name: 'matic', url: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=025' },
    { name: 'doge', url: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=025' },
    { name: 'shib', url: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png?v=025' },
    { name: 'uni', url: 'https://cryptologos.cc/logos/uniswap-uni-logo.png?v=025' },
    { name: 'ltc', url: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=025' },
    { name: 'atom', url: 'https://cryptologos.cc/logos/cosmos-atom-logo.png?v=025' },

    // Stocks / Standard transparent PNGs from simple unauthenticated CDNs or raw github
    // Since wikimedia throws 403, using raw github content from a known icons repo
    { name: 'tsla', url: 'https://raw.githubusercontent.com/Lukas-W/simple-icons/master/icons/tesla.svg' },
    { name: 'amazon', url: 'https://raw.githubusercontent.com/Lukas-W/simple-icons/master/icons/amazon.svg' },
    { name: 'netflix', url: 'https://raw.githubusercontent.com/Lukas-W/simple-icons/master/icons/netflix.svg' },
    { name: 'mstr', url: 'https://raw.githubusercontent.com/Lukas-W/simple-icons/master/icons/microstrategy.svg' },
    { name: 'aapl', url: 'https://raw.githubusercontent.com/Lukas-W/simple-icons/master/icons/apple.svg' }
];

function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            // Handle redirects if necessary
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
    console.log('Downloading more logos...');
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
