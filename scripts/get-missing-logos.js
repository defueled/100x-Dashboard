const fs = require('fs');
const https = require('https');
const path = require('path');

const logosPath = path.join(__dirname, '../public/assets/logos');

const targets = [
    { name: 'tsla', url: 'https://cdn.simpleicons.org/tesla' },
    { name: 'amazon', url: 'https://cdn.simpleicons.org/amazon' },
    { name: 'netflix', url: 'https://cdn.simpleicons.org/netflix' },
    { name: 'mstr', url: 'https://cdn.simpleicons.org/microstrategy' },
    { name: 'aapl', url: 'https://cdn.simpleicons.org/apple' }
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
    for (const t of targets) {
        const ext = '.svg';
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
