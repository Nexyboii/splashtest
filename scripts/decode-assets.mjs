// Decodes the base64 photo transport files (assets-b64/*.b64) back into
// real JPGs under public/photos/ before the Vite build runs.
//
// Why: the GitHub connector's snapshot push only accepts UTF-8 text, so the
// photos travel as base64 text and are decoded at build time (same pattern
// as the Sarayou PROD repo). Netlify runs this first — see netlify.toml.
// It is idempotent: re-running it just rewrites the same bytes.
//
// v2: only the allowlisted v2 photos are decoded. Older v1 .b64 files may
// still sit in assets-b64/ from the rejected v1 build; they are inert and
// are never decoded or shipped.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "assets-b64");
const outDir = join(root, "public", "photos");

// v2 photo set — must match src/config.js exactly.
const PHOTOS = [
  "hero.jpg",
  "hero-alt.jpg",
  "protection.jpg",
  "wash.jpg",
  "interior.jpg",
  "wheels.jpg",
  "gallery-2.jpg",
  "gallery-3.jpg",
  "gallery-4.jpg",
  "gallery-6.jpg",
  "gallery-9.jpg",
  "gallery-10.jpg",
  "gallery-12.jpg",
  "gallery-14.jpg",
  "gallery-16.jpg",
  "gallery-17.jpg",
  "slide-1.jpg",
  "slide-2.jpg",
  "slide-6.jpg",
  "slide-7.jpg",
  "logo.jpg",
  "street-3396.jpg",
  "street-3397.jpg",
  "street-3398.jpg",
  "street-3399.jpg",
  "street-3400.jpg",
];

mkdirSync(outDir, { recursive: true });

for (const name of PHOTOS) {
  const b64 = readFileSync(join(srcDir, `${name}.b64`), "utf8").replace(/\s+/g, "");
  writeFileSync(join(outDir, name), Buffer.from(b64, "base64"));
  console.log(`decode-assets: ${name}`);
}
console.log(`decode-assets: decoded ${PHOTOS.length} photos into public/photos/`);
if (!existsSync(join(outDir, "hero.jpg"))) {
  console.error("decode-assets: hero photo hero.jpg missing after decode");
  process.exit(1);
}
