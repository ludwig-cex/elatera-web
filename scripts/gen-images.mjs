// Image generation via the Gemini ("Nano Banana") image API.
// Run with the key loaded from the gitignored .env.local:
//   node --env-file=.env.local scripts/gen-images.mjs           (skip existing)
//   node --env-file=.env.local scripts/gen-images.mjs --force    (regenerate all)
//
// Robust to model-id uncertainty: tries a list of candidate image models
// (override with GEMINI_IMAGE_MODEL) and uses the first that returns an image.

import { mkdir, writeFile, stat, readFile } from "node:fs/promises";
import { dirname, extname } from "node:path";
import { JOBS } from "./image-jobs.mjs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error(
    "GEMINI_API_KEY fehlt. Lege ihn in mein-apothekenrat/.env.local an und starte mit:\n" +
      "  node --env-file=.env.local scripts/gen-images.mjs",
  );
  process.exit(1);
}

const FORCE = process.argv.includes("--force");
// --only=<substring>  filter JOBS to file paths containing this substring,
// so you can iterate on a single product or image without re-spending the
// rest of the catalog (e.g. `--only=mobilisana` or `--only=knochen`).
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice("--only=".length);
// --not=<substring>   inverse of --only; skip JOBS whose file paths contain
// this substring. Handy for "regenerate everything except this one product".
const NOT = process.argv.find((a) => a.startsWith("--not="))?.slice("--not=".length);
const MODELS = (
  process.env.GEMINI_IMAGE_MODEL
    ? [process.env.GEMINI_IMAGE_MODEL]
    : [
        "gemini-3-pro-image-preview",
        "gemini-2.5-flash-image",
        "gemini-2.5-flash-image-preview",
        "gemini-2.0-flash-preview-image-generation",
      ]
).slice();

const API = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

async function fileExists(p) {
  try {
    const s = await stat(p);
    return s.size > 0;
  } catch {
    return false;
  }
}

function extractImage(json) {
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const d = part?.inlineData ?? part?.inline_data;
    if (d?.data) return d.data;
  }
  return null;
}

let workingModel = null;

function mimeFor(p) {
  const e = extname(p).toLowerCase();
  if (e === ".png") return "image/png";
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".webp") return "image/webp";
  return "image/png";
}

async function buildParts(prompt, refs) {
  const parts = [];
  for (const ref of refs ?? []) {
    const buf = await readFile(ref);
    parts.push({
      inlineData: { mimeType: mimeFor(ref), data: buf.toString("base64") },
    });
  }
  parts.push({ text: prompt });
  return parts;
}

async function generate(prompt, refs) {
  const parts = await buildParts(prompt, refs);
  const models = workingModel ? [workingModel] : MODELS;
  let lastErr = "";
  for (const model of models) {
    const res = await fetch(API(model), {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    });
    if (!res.ok) {
      lastErr = `${model}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`;
      continue;
    }
    const json = await res.json();
    const b64 = extractImage(json);
    if (b64) {
      if (!workingModel) {
        workingModel = model;
        console.log(`→ verwende Modell: ${model}`);
      }
      return Buffer.from(b64, "base64");
    }
    lastErr = `${model}: kein Bild in Antwort`;
  }
  throw new Error(lastErr || "kein Modell lieferte ein Bild");
}

let ok = 0;
let skipped = 0;
let failed = 0;

for (const job of JOBS) {
  if (ONLY && !job.file.includes(ONLY)) {
    skipped++;
    continue;
  }
  if (NOT && job.file.includes(NOT)) {
    skipped++;
    continue;
  }
  if (!FORCE && (await fileExists(job.file))) {
    console.log(`= skip (vorhanden): ${job.file}`);
    skipped++;
    continue;
  }
  try {
    process.stdout.write(`… generiere ${job.file} … `);
    const buf = await generate(job.prompt, job.refs);
    await mkdir(dirname(job.file), { recursive: true });
    await writeFile(job.file, buf);
    console.log(`OK (${Math.round(buf.length / 1024)} KB)`);
    ok++;
  } catch (e) {
    console.log(`FEHLER: ${e.message}`);
    failed++;
  }
}

console.log(`\nFertig — ${ok} erzeugt, ${skipped} übersprungen, ${failed} fehlgeschlagen.`);
process.exit(failed > 0 && ok === 0 ? 1 : 0);
