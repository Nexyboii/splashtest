// Splash Car Wash & Detailing — site config.
// CONFIRMED facts only (verified 2026-11-15 against the live site + Google).
// Anything marked TODO is waiting on Rahul's confirmation — DO NOT publish
// a guessed value. See ../research/RESEARCH.md for sources and conflicts.

export const site = {
  name: "Splash Car Wash & Detailing",
  tagline: "Adelaide's hand car wash, paint protection & detailing experts since 2001",
  address: "395 Glen Osmond Rd, Glen Osmond SA 5064",
  phoneDisplay: "08 8379 7700",
  phoneHref: "tel:0883797700",
  email: "info@splashcarwash.com.au",
  hours: [
    { days: "Monday – Saturday", time: "8:00 AM – 5:00 PM" },
    { days: "Sunday", time: "9:00 AM – 4:00 PM" },
  ],
  founded: 2001,
  yearsExperience: 25, // 2001 -> Nov 2026
  googleRating: 4.2,
  // Review count moves by source/date (166 exa.ai, 173 agentize Oct 2026,
  // 175+ Spott). Display as "170+" — never a precise invented count.
  googleReviewsText: "170+",
  // No brushes, no rollers, no brooms — microfibre mitt hand wash,
  // touch-free arch rinse/wax. Verified from the live site's own copy.
  promise: "No brushes. No rollers. No brooms. No scratches.",
};

// Booking: CALL-ONLY — decided by Rahul 2026-11-15 ("Keep it call-only").
// No online booking anywhere on the site: every CTA is a tel: link, and
// services are split into "No booking required" (walk in) vs
// "Please call for booking". The live Acuity page exists but is NOT linked.
export const booking = {
  mode: "call-only",
  acuityUrl: "https://app.acuityscheduling.com/schedule/ca1f414d", // NOT linked — kept for reference only
};

// PROPOSED canonical prices, from the live site's Main Packages table.
// NOT yet confirmed by Rahul. Known conflicts (do not silently resolve):
// - Hand wash "from $28" (homepage) vs Super Wash $29.95
// - Machine polishing "from $380" (homepage) vs "from $250" (Major Detail)
// - Hand wax $30 (promo) vs $35 (Major Detail)
// - Leather/steam "from $50" vs "$50 per seat"
// - Major $330 vs Double Mini $250-330 vs Full Detail $390-550 vs Acuity
//   Complete $325-450 — what actually differs between them is unexplained.
export const pricesProposed = {
  status: "PROPOSED — awaiting Rahul confirmation",
  // Packages from the live site's Main Packages table + service pages.
  // CORRECTION 2026-11-15: Deep Clean Detail DOES have a page
  // (/splash-deep-clean-detail/, $95/$100/$110) — the audit's broken
  // link was the Services page pointing at ?page_id=1759 instead.
  packages: [
    { name: "Super Wash", desc: "Exterior hand wash — grime, bugs & bird droppings removed, pre-soak, foam shampoo & microfibre mitt wash, wheels & under-body spray, blow dry & hand towel dry. One price does it all.", small: 29.95, medium: 34.95, large: 39.95, book: "walk-in" },
    { name: "Mini Detail — “The Works”", desc: "Super Wash + interior vacuum (floors, seats, mats, boot), dash, console & steering column wiped, rubber mats washed.", small: 69.95, medium: 75.0, large: 85.0, book: "walk-in" },
    { name: "Deep Clean Detail", desc: "Interior deep clean — full vacuum, dash/console/seats/door trims wiped, mats washed, door & boot jambs cleaned, air freshener, tyre shine & paint sealant.", small: 95, medium: 100, large: 110, book: "call" },
    { name: "Superior Mini Detail", desc: "Mini Detail + paint protection sealant (Gtechniq C2, up to 4 months protection).", small: 100, medium: 110, large: 120, book: "call" },
    { name: "Double Mini Detail", desc: "Superior Mini + Deep Clean interior. Takes 3–4 hours.", small: "250–330", medium: "250–330", large: "250–330", book: "call" },
    { name: "Full Detail", desc: "Our most complete detail — call us and we will tailor it to your car. (No inclusions published on the live site; do not invent any.)", small: "390–550", medium: "390–550", large: "390–550", book: "call" },
  ],
  paintProtectionFrom: 995,
  // Machine polishing: homepage says from $380, Major Detail page says
  // from $250. Preview uses $380 (the customer-facing card) — FLAGGED for
  // Rahul to confirm. Hand wax: $35 standalone, $30 with any wash
  // (reconciles the $30 promo and the $35 add-on list).
  extras: [
    { name: "Machine polishing", price: "from $380", note: "Price to confirm — Major Detail page says from $250." },
    { name: "Hand wax", price: "$35", note: "$30 with any wash." },
    { name: "Major Detail — ready for sale", price: "from $330", note: "Full interior detail. Call to discuss your car." },
  ],
};

// TODO (blocked on Rahul): Gtechniq Crystal Serum warranty wording.
// Live page states NO warranty length. Rahul's video text says
// "9 Years Warranty" and "17 Years Paint Protection" — do not publish either
// until he confirms the exact wording. The four points below are from
// Rahul's own ceramic video text — his claims, kept as product points.
export const paintProtection = {
  product: "Gtechniq Crystal Serum",
  warranty: "TODO — awaiting Rahul confirmation",
  points: [
    "Incredible gloss",
    "10H hardness",
    "Chemical resistance",
    "Protection against UV damage",
  ],
  includes: [
    "Crystal Lacquer",
    "Clear Vision Glass",
    "Ultimate Leather",
    "Fabric Nanocoat",
    "Wheel Armour",
  ],
};

// Reviews: VERBATIM quotes only, from public search listings. Never invent.
// Aggregate is mixed (4.2★ overall; some 1–2★ reviews exist) — the site
// shows the honest aggregate and links out to read all reviews.
export const reviews = {
  rating: 4.2,
  countText: "170+ Google reviews",
  allReviewsUrl: "https://reviews.birdeye.com/splash-car-wash-detailing-167037460212182",
  quotes: [
    {
      text: "After Rick's car getting concrete splash all over it because of irresponsible actions by some concrete pump guys… it's gleaming again! Thanks to Suka and the guys at Splash Car Wash & Detailing for another great job of polish and ceramic coating! As always, they also did an awesome job of washing my car…. We have had ALL our cars looked after here, Highly recommend!",
      stars: 5,
      source: "Google review, Feb 2026",
    },
    {
      text: "Splash is perfect! Well worth going there.",
      stars: 5,
      source: "Jamie Martin, via dlook",
    },
  ],
};

// Photos: Rahul's own site photos, recovered from splashcarwash.com.au.
// Hero must use the two 2048px shots; the rest are 960px (cards/gallery).
export const photos = {
  hero: "/photos/Slide_3.jpg", // red classic Porsche 911 in the studio, 2048x1365
  heroAlt: "/photos/Slide_4.jpg", // silver supercar close-up, 2048x1637
  logo: "/photos/logo.jpg", // business logo (full: circle mark + "Splash" wordmark), supplied by Rahul 2026-11-15
  logoMark: "/photos/logo-mark.jpg", // circle badge only, cropped from logo.jpg for the header
  gallery: [
    "Gallery-1.jpg", "Gallery-2.jpg", "Gallery-3.jpg", "Gallery-4.jpg",
    "Gallery-5.jpg", "Gallery-6.jpg", "Gallery-9.jpg", "Gallery-10.jpg",
    "Gallery-11.jpg", "Gallery-12.jpg", "Gallery-14.jpg", "Gallery-16.jpg",
    "Gallery-17.jpg", "Gallery-18.jpg",
  ],
};
