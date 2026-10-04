// One-off portrait processing for the About figure.
// Source stays in assets-src/ (git-ignored); only the processed files ship.
//   node scripts/process-photo.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "assets-src/portrait-source.jpg";

// 4:5 crop on the 1023x1537 source: just above the head to just below the pocket square.
const CROP = { left: 172, top: 228, width: 552, height: 690 };

// Warm paper tone (#f2efe8) so highlights match the page instead of pure white.
const PAPER = { r: 242, g: 239, b: 232 };

const base = () =>
  sharp(SOURCE)
    .extract(CROP)
    .grayscale()
    // gentle contrast lift that keeps lapel detail in the blacks
    .linear(1.1, -10)
    .tint(PAPER);

await mkdir("public", { recursive: true });

await base().resize(320, 400, { kernel: "lanczos3" }).avif({ quality: 58, effort: 7 }).toFile("public/about-320.avif");
await base().resize(640, 800, { kernel: "lanczos3" }).avif({ quality: 55, effort: 7 }).toFile("public/about-640.avif");
await base().resize(640, 800, { kernel: "lanczos3" }).jpeg({ quality: 80, mozjpeg: true }).toFile("public/about-640.jpg");

console.log("Wrote public/about-320.avif, public/about-640.avif, public/about-640.jpg");
