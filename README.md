# Splash Car Wash & Detailing — website

Rebuilt preview of [splashcarwash.com.au](https://splashcarwash.com.au/):
Vite + React 18 SPA, mobile-first, call-only bookings.

- **Business:** Splash Car Wash & Detailing, 395 Glen Osmond Rd, Glen Osmond SA 5064
- **Phone:** 08 8379 7700 · **Email:** info@splashcarwash.com.au
- **Hours:** Mon–Sat 8:00 AM – 5:00 PM, Sun 9:00 AM – 4:00 PM
- **Booking:** call-only — every CTA is a tap-to-call link. No online booking.

## Develop

```sh
npm install
npm run build   # outputs to dist/
```

## Photos

The photos are the business's own (recovered from the live site). They travel
in this repo as base64 text under `assets-b64/` because the GitHub connector
only accepts UTF-8 text pushes — `scripts/decode-assets.mjs` decodes them
into `public/photos/` before the build (Netlify runs it first; see
`netlify.toml`). The decoded JPGs are build output, not committed source.

## Content rules

- Prices come from the live site's price table + service pages. Do not invent
  prices, warranty years, reviews, or inclusions.
- Reviews shown are verbatim quotes from public listings.
- See `src/config.js` — it is the single source of truth for business facts.
