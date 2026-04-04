/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function run() {
    const files = fs.readdirSync('public/assets');
    for (const f of files) {
        if (f.endsWith('.png') || f.endsWith('.svg')) {
            try {
                const img = await loadImage('public/assets/' + f);
                console.log(`${f}: ${img.width}x${img.height}`);
            } catch (e) {
                console.log(`Failed ${f}`);
            }
        }
    }
}
run();
