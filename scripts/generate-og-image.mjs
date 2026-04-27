// One-shot OG image generator. Run: `node scripts/generate-og-image.mjs`
// Outputs: public/og-image.png (1200×630, brand-tinted)
import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const W = 1200;
const H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// Brand background — soft gradient using brand-blue + brand-green tokens
const grad = ctx.createLinearGradient(0, 0, W, H);
grad.addColorStop(0, "#0f1319");
grad.addColorStop(0.55, "#1a2742");
grad.addColorStop(1, "#0f1319");
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);

// Color glows
const glow1 = ctx.createRadialGradient(180, 520, 20, 180, 520, 520);
glow1.addColorStop(0, "rgba(89, 182, 135, 0.45)");
glow1.addColorStop(1, "rgba(89, 182, 135, 0)");
ctx.fillStyle = glow1;
ctx.fillRect(0, 0, W, H);

const glow2 = ctx.createRadialGradient(1050, 110, 20, 1050, 110, 480);
glow2.addColorStop(0, "rgba(24, 139, 246, 0.45)");
glow2.addColorStop(1, "rgba(24, 139, 246, 0)");
ctx.fillStyle = glow2;
ctx.fillRect(0, 0, W, H);

// Logo
const logo = await loadImage(resolve("public/assets/logos/100x-refined-logo.png"));
const logoSize = 160;
ctx.drawImage(logo, 80, 80, logoSize, logoSize);

// Headline
ctx.fillStyle = "#ffffff";
ctx.font = "bold 86px 'Helvetica', sans-serif";
ctx.fillText("100x.lv", 80, 360);

// Subhead
ctx.fillStyle = "rgba(229, 231, 235, 0.92)";
ctx.font = "500 40px 'Helvetica', sans-serif";
ctx.fillText("Viedā Komūna", 80, 415);

// Tagline
ctx.fillStyle = "rgba(155, 163, 176, 0.95)";
ctx.font = "400 30px 'Helvetica', sans-serif";
ctx.fillText("Apvienojam AI, FinTech un Web3.0 tehnoloģijas vienuviet.", 80, 470);

// Brand chips
const chips = [
    { label: "AI", color: "#188bf6" },
    { label: "FinTech", color: "#f6ad55" },
    { label: "Web3.0", color: "#59b687" },
];
let cx = 80;
ctx.font = "600 22px 'Helvetica', sans-serif";
for (const chip of chips) {
    const w = ctx.measureText(chip.label).width + 36;
    ctx.fillStyle = chip.color;
    const r = 24;
    const y = 520;
    ctx.beginPath();
    ctx.moveTo(cx + r, y);
    ctx.arcTo(cx + w, y, cx + w, y + 48, r);
    ctx.arcTo(cx + w, y + 48, cx, y + 48, r);
    ctx.arcTo(cx, y + 48, cx, y, r);
    ctx.arcTo(cx, y, cx + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#0f1319";
    ctx.fillText(chip.label, cx + 18, y + 32);
    cx += w + 14;
}

const out = resolve("public/og-image.png");
writeFileSync(out, canvas.toBuffer("image/png"));
console.log("✅ Wrote", out);
