# Splash Car Wash & Detailing — website v2 (fresh rebuild)

Rebuilt from scratch in this repo (`Nexyboii/splashtest`) on 2026-11-15, from
Rahul's Website & Brand DNA Report. The v1 build (Three.js 3D scroll hero)
was rejected by Rahul and is fully replaced — no v1 code ships.

- **Stack:** Vite + React 18, mobile-first, call-only (no booking form).
- **Design:** white content, charcoal header/footer, deep navy + aqua/cyan,
  orange-red Call buttons. Glassmorphism nav/cards/modals, animated buttons,
  smooth hash-route transitions, service popups ("What's included"),
  gallery lightbox.
- **Data:** all prices, steps and copy live in `src/config.js` — from the DNA
  only. Nothing is invented. See `../DNA.md` in the workspace for the DNA
  report and the price conflicts the live site itself has.
- **Photos:** real Splash photos from splashcarwash.com.au (red Porsche hero),
  plus Rahul's Street View shopfront shots (cropped) and the Splash logo.
  They travel as base64 text in `assets-b64/` (the GitHub connector only
  accepts UTF-8) and are decoded into `public/photos/` at build time by
  `scripts/decode-assets.mjs`. Netlify runs the decoder first (see
  `netlify.toml`).
- **Checks:** `npm run build`, then the jsdom boot audit
  (`~/workspace/tools/jsdomtest/test-splash-v2.cjs`) — 55/55 checks across all
  5 routes: mount, real rendered prices/values, modal behaviour, no
  "Book online", no warranty years, no invented reviews, no `$undefined`.

## Develop

```bash
npm run build   # production build into dist/
```

## Deploy

Netlify builds from `main`: `node scripts/decode-assets.mjs && npm run build`,
publishes `dist/`. The live site splashcarwash.com.au is untouched by this
repo — this is a preview rebuild only.
