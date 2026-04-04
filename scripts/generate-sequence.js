const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const dir = path.join(__dirname, '../public/sequence');
const logosDir = path.join(__dirname, '../public/assets/logos');

// Ensure directory exists
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const numFrames = 120;
const numSmall = 48; // Increased for variety
const radiusExplosion = 500;
const width = 1920;
const height = 1080;

async function generate() {
  console.log('Generating 120 abstract frames...');

  // Load all logos dynamically
  const allFiles = fs.readdirSync(logosDir);
  const loadedLogosMap = new Map();
  for (const f of allFiles) {
    if (f.startsWith('100x-')) continue;
    const name = f.split('.')[0];
    const ext = f.split('.').pop();

    // Prefer SVG for icons if available, or just keep unique names
    if (!loadedLogosMap.has(name) || ext === 'svg') {
      loadedLogosMap.set(name, f);
    }
  }

  const loadedLogos = [];
  for (const [name, filename] of loadedLogosMap) {
    try {
      const img = await loadImage(path.join(logosDir, filename));
      loadedLogos.push(img);
    } catch (e) {
      console.error('Failed to load ' + filename);
    }
  }
  console.log(`Loaded ${loadedLogos.length} unique logos.`);

  let logo100x;
  try {
    logo100x = await loadImage(path.join(logosDir, '100x-refined-logo.png'));
  } catch (e) {
    console.error('Failed to load refined logo, falling back');
    logo100x = await loadImage(path.join(logosDir, '100x-logo.png'));
  }

  // An abstract geometric "exploded" product animation
  for (let i = 0; i < numFrames; i++) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Progress 0 to 1
    const progress = i / (numFrames - 1);

    // Easing function for smooth explosion (easeOutExpo)
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    // Draw background
    ctx.fillStyle = '#F8FAF9';
    ctx.fillRect(0, 0, width, height);

    // Center
    const cx = width / 2;
    const cy = height / 2;

    // Base 100x Logo
    if (logo100x) {
      const s = 400 - (easeProgress * 50);
      ctx.drawImage(logo100x, cx - s / 2, cy - s / 2, s, s);
    } else {
      ctx.fillStyle = `rgba(44, 51, 69, ${1 - easeProgress * 0.5})`; // brand-dark
      ctx.beginPath();
      ctx.arc(cx, cy, 200 - (easeProgress * 50), 0, Math.PI * 2);
      ctx.fill();
    }

    // Neon Mint Green Ring
    ctx.strokeStyle = '#a7f3d0'; // bright mint
    ctx.lineWidth = 6 + (easeProgress * 4);
    ctx.shadowColor = '#22c55e'; // glow
    ctx.shadowBlur = 25;
    ctx.beginPath();
    // Starts inside, expands out
    ctx.arc(cx, cy, 180 + (easeProgress * 150), 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Exploding particles/components
    const numParticles = 24;
    for (let j = 0; j < numParticles; j++) {
      const angle = (j / numParticles) * Math.PI * 2;

      // Distance from center based on easing
      // They start closely bound (190), explode heavily (up to 600)
      const distance = 190 + (easeProgress * 400 * (1 + (j % 3) * 0.5));

      const px = cx + Math.cos(angle) * distance;
      const py = cy + Math.sin(angle) * distance;

      ctx.save();
      ctx.translate(px, py);
      // Add some rotation to the components as they fly out
      ctx.rotate(progress * Math.PI * 2 * (j % 2 === 0 ? 1 : -1));

      // Fade in the flying logos based on progress (from thin air)
      // They start at 0 opacity and fade in completely by ~30% progress
      ctx.globalAlpha = Math.min(1, easeProgress * 3);

      // Draw logo if available
      const logoImg = loadedLogos[j % loadedLogos.length];
      if (logoImg) {
        // Reduced size (35px instead of 50px)
        ctx.drawImage(logoImg, -17.5, -17.5, 35, 35);
      } else {
        ctx.fillStyle = j % 3 === 0 ? '#188bf6' : (j % 3 === 1 ? '#22c55e' : '#f6ad55'); // brand colors
        ctx.fillRect(-15, -15, 30, 30);
      }

      ctx.restore();
    }

    // Add a subtle "energy" pulse at exactly halfway
    if (progress > 0.4 && progress < 0.6) {
      const pulseProgress = (progress - 0.4) / 0.2; // 0 to 1
      const pulseEase = Math.sin(pulseProgress * Math.PI); // 0 -> 1 -> 0

      ctx.strokeStyle = `rgba(34, 197, 94, ${pulseEase * 0.3})`; // brand-green
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 250 + (pulseEase * 300), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Save the frame
    // Format: 0000.jpg to 0119.jpg
    const filename = String(i).padStart(4, '0') + '.jpg';
    const outPath = path.join(dir, filename);

    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync(outPath, buffer);

    if (i % 20 === 0) console.log(`Generated frame ${i}...`);
  }

  console.log('Sequence generation complete! Saved to public/sequence/');
}

generate().catch(console.error);
