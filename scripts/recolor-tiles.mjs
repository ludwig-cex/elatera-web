// Recolor the flat background of the three Canva tiles (credentials = expert
// testimonial, claims = "Das kann … für Sie tun", nutrients = Nährstoff-Tabelle)
// so it matches each product's palette.bg instead of the template's stock blue.
//
// The gallery (hero-gallery.tsx) already paints palette.bg behind each tile, so
// once the tile's own background matches, the seam disappears for every product.
//
// Method: the tiles have a single flat pastel background. We sample the exact
// background from a corner, then replace every pixel within a tight per-channel
// tolerance of it with the target palette colour. The credentials tile contains
// the pharmacist photo, so there we additionally require the bg's bluish hue
// signature (b>r, b>=g) — that protects neutral (white coat) and warm (shelf)
// photo tones, which a plain tolerance box could otherwise clip.
//
// Idempotent: re-running on an already-correct tile replaces bg pixels with the
// same colour (no-op). Originals are git-tracked, so `git checkout` restores.
//
// Run: node scripts/recolor-tiles.mjs

import sharp from "sharp";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Tiles with a flat baked-in background → recolor by replacing that colour.
const TILES = ["credentials", "claims", "nutrients"];
const PHOTO_TILE = "credentials";
// qualitaet ships with a TRANSPARENT background (text + check outlines only),
// so the gallery container colour showed through in the big view but the
// inactive thumbnail (ivory button) made it look white/odd next to the now
// opaque tiles. Flatten it onto palette.bg so every tile is opaque and uniform.
const FLATTEN_TILES = ["qualitaet"];
const TOL = 16; // per-channel tolerance around the sampled background colour

// --- Parse slug -> palette.bg from products.ts (single source of truth) ---
const src = readFileSync(join(root, "src/lib/products.ts"), "utf8");
const slugs = [...src.matchAll(/slug:\s*"([a-z]+)"/g)].map((m) => m[1]);
const bgs = [...src.matchAll(/palette:\s*\{\s*bg:\s*"(#[0-9a-fA-F]{6})"/g)].map((m) => m[1]);
if (slugs.length !== bgs.length || slugs.length === 0) {
  throw new Error(`slug/palette mismatch: ${slugs.length} slugs vs ${bgs.length} palettes`);
}
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const palette = Object.fromEntries(slugs.map((s, i) => [s, hexToRgb(bgs[i])]));

async function recolor(file, target, isPhoto) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const C = [data[0], data[1], data[2]]; // top-left corner = flat background
  const out = Buffer.from(data);
  let changed = 0;
  for (let i = 0; i < data.length; i += c) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const within =
      Math.abs(r - C[0]) <= TOL && Math.abs(g - C[1]) <= TOL && Math.abs(b - C[2]) <= TOL;
    if (!within) continue;
    if (isPhoto && !(b - r >= 6 && b - g >= 0 && g - r >= 0)) continue; // keep neutral/warm photo tones
    out[i] = target[0];
    out[i + 1] = target[1];
    out[i + 2] = target[2];
    changed++;
  }
  await sharp(out, { raw: { width: w, height: h, channels: c } }).png().toFile(file);
  return { share: (changed / (w * h)) * 100, src: C };
}

// Composite a transparent tile onto an opaque palette background.
async function flattenOnto(file, target) {
  const buf = await sharp(file)
    .flatten({ background: { r: target[0], g: target[1], b: target[2] } })
    .png()
    .toBuffer();
  await sharp(buf).toFile(file);
}

for (const slug of slugs) {
  const target = palette[slug];
  for (const tile of TILES) {
    const file = join(root, `public/products/${slug}/${tile}.png`);
    if (!existsSync(file)) {
      console.log(`  ${slug}/${tile}: MISSING — skipped`);
      continue;
    }
    const { share, src: c } = await recolor(file, target, tile === PHOTO_TILE);
    console.log(
      `~ ${slug}/${tile}: bg ${c.join(",")} -> ${target.join(",")}  (${share.toFixed(1)}% recolored)`,
    );
  }
  for (const tile of FLATTEN_TILES) {
    const file = join(root, `public/products/${slug}/${tile}.png`);
    if (!existsSync(file)) {
      console.log(`  ${slug}/${tile}: MISSING — skipped`);
      continue;
    }
    await flattenOnto(file, target);
    console.log(`▣ ${slug}/${tile}: flattened onto ${target.join(",")}`);
  }
}
console.log("\nDone. Review the tiles, then commit public/products/*/{credentials,claims,nutrients}.png");
