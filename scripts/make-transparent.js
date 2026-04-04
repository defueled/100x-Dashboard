const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function removeBg() {
    const img = await loadImage('public/assets/logos/100x-logo.png');
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // The background might be off-white or light green.
    // Let's sample the top-left pixel
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    const threshold = 15; // Tolerance

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // If distance to bg color is small, set alpha to 0
        if (Math.abs(r - bgR) < threshold && Math.abs(g - bgG) < threshold && Math.abs(b - bgB) < threshold) {
            data[i + 3] = 0;
        }
    }

    ctx.putImageData(imgData, 0, 0);
    const out = fs.createWriteStream('public/assets/logos/100x-logo-transparent.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Transparent logo saved.'));
}
removeBg().catch(console.error);
