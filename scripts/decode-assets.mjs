// Decodes the base64 photo transport files (assets-b64/*.b64) back into
// real JPGs under public/photos/ before the Vite build runs.
//
// Why: the GitHub connector's snapshot push only accepts UTF-8 text, so the
// photos travel as base64 text and are decoded at build time (same pattern
// as the Sarayou PROD repo). Netlify runs this first — see netlify.toml.
// It is idempotent: re-running it just rewrites the same bytes.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "assets-b64");
const outDir = join(root, "public", "photos");

mkdirSync(outDir, { recursive: true });

const files = readdirSync(srcDir).filter((f) => f.endsWith(".b64"));
if (files.length === 0) {
  console.error("decode-assets: no .b64 files found in assets-b64/");
  process.exit(1);
}
for (const f of files) {
  const name = f.replace(/\.b64$/, "");
  const b64 = readFileSync(join(srcDir, f), "utf8").replace(/\s+/g, "");
  writeFileSync(join(outDir, name), Buffer.from(b64, "base64"));
  console.log(`decode-assets: ${name}`);
}
console.log(`decode-assets: decoded ${files.length} photos into public/photos/`);
if (!existsSync(join(outDir, "Slide_3.jpg"))) {
  console.error("decode-assets: hero photo Slide_3.jpg missing after decode");
  process.exit(1);
}
