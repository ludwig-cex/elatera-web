// Generate raster favicon assets from src/app/icon.svg (the framed-N mark).
// Run: node scripts/gen-favicon.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "src/app/icon.svg"));

async function png(size) {
  return sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
}

// Apple touch icon.
writeFileSync(join(root, "src/app/apple-icon.png"), await png(180));

// Build a real .ico containing 16/32/48 PNG frames (PNG-in-ICO, Vista+).
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(frames.length, 4);
const dir = Buffer.alloc(16 * frames.length);
let offset = 6 + dir.length;
frames.forEach((buf, i) => {
  const e = i * 16;
  dir.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], e + 0); // width
  dir.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], e + 1); // height
  dir.writeUInt8(0, e + 2); // palette
  dir.writeUInt8(0, e + 3); // reserved
  dir.writeUInt16LE(1, e + 4); // color planes
  dir.writeUInt16LE(32, e + 6); // bits per pixel
  dir.writeUInt32LE(buf.length, e + 8); // size of frame
  dir.writeUInt32LE(offset, e + 12); // offset
  offset += buf.length;
});
writeFileSync(join(root, "src/app/favicon.ico"), Buffer.concat([header, dir, ...frames]));

console.log("Wrote src/app/favicon.ico, src/app/apple-icon.png");
