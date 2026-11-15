// Splash Car Wash & Detailing — single source of truth.
// ALL values come from Rahul's Brand DNA Report (2026-11-15) and the live
// site splashcarwash.com.au. Nothing here is invented. Where the live site
// itself conflicts, the DNA value is used and the conflict is noted in
// ../DNA.md — the site must never print a price or claim that is not in
// this file. A missing price is `null` and the UI must show "Call for price".

export const business = {
  name: "Splash Car Wash & Detailing",
  shortName: "Splash",
  tagline: "We Care For Your Car",
  heroLine: "Hand wash only! Because we Care.",
  heroSub:
    "Relax, coffee in hand, as our staff pamper your vehicle. From exotics to daily drivers, we cater to your needs — washed in 100% spring water, dried by hand.",
  founded: 2001,
  sinceText: "Serving Adelaide's cars since 2001",
  yearsText: "25 years in Glen Osmond",
  address: "395 Glen Osmond Road, Glen Osmond SA 5064",
  addressShort: "395 Glen Osmond Rd, Glen Osmond",
  phoneDisplay: "08 8379 7700",
  phoneHref: "tel:0883797700",
  email: "info@splashcarwash.com.au",
  website: "splashcarwash.com.au",
  hoursWeekday: "Monday – Saturday: 8:00am – 5:00pm",
  hoursSunday: "Sunday: 9:00am – 4:00pm",
  hoursShort: "Open 7 days · Mon–Sat 8am–5pm · Sun 9am–4pm",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Splash+Car+Wash+%26+Detailing+395+Glen+Osmond+Road+Glen+Osmond+SA+5064",
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=Splash+Car+Wash+%26+Detailing+395+Glen+Osmond+Road+Glen+Osmond+SA+5064",
  rating: "4.1",
  reviewCount: "175",
  reviewSource: "Google reviews",
  logo: "/photos/logo.jpg",
  heroPhoto: "/photos/hero.jpg",
  heroAltPhoto: "/photos/hero-alt.jpg",
};

export const pillars = [
  {
    n: "01",
    title: "Hand wash only!",
    text: "Because we Care. Every car is washed by hand — never a tunnel, never brushes.",
  },
  {
    n: "02",
    title: "Rain protection programs",
    text: "Treatments that help rain bead and roll off, keeping your car cleaner for longer.",
  },
  {
    n: "03",
    title: "Interior, paint & tinting",
    text: "Interior protection, paint protect and window tinting — all under one roof.",
  },
  {
    n: "04",
    title: "Pre-sale detail",
    text: "Ready-for-sale reconditioning that helps your car present its best.",
  },
];

export const trustChips = [
  "100% spring water",
  "Hand wash only",
  "No booking needed for washes",
  "Coffee while you wait",
  "Gtechniq Crystal Serum",
  "One price does it ALL",
];

// Core packages. `from` is the Small price. `prices` are Small/Medium/Large.
// `booking` must be one of the two DNA wordings. `steps`/`includes` are
// published inclusions only.
export const packages = [
  {
    id: "superwash",
    name: "Splash SUPERWASH",
    sub: "Exterior Hand Wash",
    from: 28,
    prices: { small: 28, medium: 31, large: 35 },
    booking: "No booking required",
    bookingNote: "Just drive in — while you wait.",
    tag: "Most popular",
    photo: "/photos/wash.jpg",
    photoAlt: "Staff hand-wiping a car at Splash",
    blurb:
      "The entry-level exterior hand wash. One price does it ALL — no hidden surcharges for under-body spray, wheel cleaning or bug removal.",
    steps: [
      "Road grime, bugs & bird droppings removed",
      "Non-caustic pre-soak & first rinse",
      "High-foam shampoo, hand washed with a microfibre mitt",
      "Superior wheel clean",
      "Under-body spray rinse",
      "High-pressure wash & rinse",
      "AutoGlym Autogloss finishing rinse",
      "Blow dry",
      "Hand towel dry — wheels, door & boot jambs",
    ],
  },
  {
    id: "works",
    name: 'Splash "The Works" Mini Detail',
    sub: "Super Wash + Interior",
    from: 65,
    prices: { small: 65, medium: 68, large: 75 },
    booking: "No booking required",
    bookingNote: "Walk-in combo package.",
    tag: "You save $12.50",
    photo: "/photos/interior.jpg",
    photoAlt: "Detailed luxury car interior",
    blurb:
      "Everything in the Super Wash, plus a full interior tidy — the walk-in combo for cars that need inside and out.",
    includes: [
      "Everything in the Splash SUPERWASH",
      "Full interior & boot vacuum",
      "Dash, console & steering column wiped down",
      "Rubber mats washed",
      "Tyre shine",
      "Door & boot jambs dried",
      "Air freshener spray",
    ],
  },
  {
    id: "deepclean",
    name: "Splash Deep Clean Detail",
    sub: "Interior + Exterior Clean",
    from: 95,
    prices: { small: 95, medium: 100, large: 110 },
    booking: "Booking recommended",
    bookingNote: "Call to book a time.",
    tag: "",
    photo: "/photos/gallery-10.jpg",
    photoAlt: "Bentley interior after a deep clean",
    blurb:
      "The mid-tier interior and exterior clean, finished with paint sealant and tyre shine.",
    includes: [
      "Interior vacuum — floors, seats, mats & boot",
      "Dash, console, steering column, seats & door trims wiped clean",
      "Rubber mats washed",
      "Door & boot jambs cleaned & dried",
      "Air freshener spray",
      "Tyre shine",
      "Paint sealant",
    ],
  },
  {
    id: "superior",
    name: "Splash Superior Mini Detail",
    sub: "Super Works — Mini Detail Plus",
    from: 95,
    prices: { small: 95, medium: 100, large: 110 },
    booking: "Booking recommended",
    bookingNote: "Call to book a time.",
    tag: "Gtechniq C2 · 4-month protection",
    photo: "/photos/protection.jpg",
    photoAlt: "Gtechniq C2 sealant being applied to a Porsche bonnet",
    blurb:
      "Mini Detail Plus, upgraded with Gtechniq C2 paint protection sealant — or a heavy-duty treatment for a very dirty car.",
    includes: [
      "Everything in the Mini Detail",
      "Gtechniq C2 Liquid Crystal paint protection sealant",
      "4 months of paint protection",
      "Suits heavily soiled cars",
    ],
  },
  {
    id: "double",
    name: "Splash Double Mini Detail",
    sub: "Extended Interior Detail",
    from: null,
    prices: null,
    booking: "Booking recommended",
    bookingNote: "Takes up to 3–4 hours — call to book.",
    tag: "Up to 3–4 hours",
    photo: "/photos/gallery-2.jpg",
    photoAlt: "Porsche interior in red leather",
    blurb:
      "Extra attention on the interior, combining Superior Mini Detail and Deep Clean Detail steps.",
    includes: [
      "Interior rejuvenation",
      "Deep trim & console clean",
      "Super wheel clean",
      "Paint sealant",
      "Tyre shine",
    ],
  },
  {
    id: "major",
    name: "Splash Major Detail",
    sub: "Ready For Sale",
    from: 330,
    prices: null,
    priceNote: "Starting from $330 — customised to your car",
    booking: "Booking recommended",
    bookingNote: "Full interior / pre-sale reconditioning.",
    tag: "Pre-sale specialists",
    photo: "/photos/gallery-4.jpg",
    photoAlt: "McLaren at the Splash shopfront",
    blurb:
      "Full interior and pre-sale reconditioning, customised to your car. Includes the full A La Carte add-on menu below.",
    includes: [
      "Full interior reconditioning",
      "Pre-sale presentation detail",
      "Customised to your car's condition",
      "Full A La Carte add-on menu available",
    ],
  },
];

export const specialists = [
  {
    id: "crystal",
    name: "Paint Protection — Crystal Serum",
    from: 995,
    priceText: "Starting from $995",
    booking: "Booking required",
    photo: "/photos/hero-alt.jpg",
    photoAlt: "Ceramic-coated car in the Splash studio",
    blurb:
      "Gtechniq Crystal Serum ceramic paint protection for new cars — the cost-saving dealership alternative.",
    points: [
      "Gtechniq Crystal Serum ceramic coating",
      "New-car treatment & paint protection",
      "Call for warranty details",
    ],
  },
  {
    id: "polishing",
    name: "Machine Polishing",
    from: 380,
    priceText: "Starting from $380",
    addOnText: "From $250 as a Major Detail add-on",
    booking: "Booking required",
    photo: "/photos/slide-1.jpg",
    photoAlt: "Staff machine-polishing a black car",
    blurb:
      "Machine polishing to lift swirls and restore gloss. Priced as a standalone treatment, or as an add-on to a Major Detail.",
    points: ["Standalone treatment from $380", "From $250 as a Major Detail add-on"],
  },
  {
    id: "headlight",
    name: "Headlight Restoration",
    from: 100,
    priceText: "Starting from $100",
    booking: "Booking required",
    photo: "/photos/wheels.jpg",
    photoAlt: "Close-up of a detailed wheel and brake",
    blurb: "Clouded headlights restored for clearer light and a fresher front end.",
    points: ["Restores clarity", "Freshens the front of the car"],
  },
  {
    id: "leather",
    name: "Leather Seat Cleaning",
    from: 50,
    priceText: "Starting from $50",
    booking: "Booking required",
    photo: "/photos/gallery-17.jpg",
    photoAlt: "Red and black leather sports interior",
    blurb:
      "Leather seats deep cleaned and rejuvenated with Gtechniq L1 Nanotech coating.",
    points: ["Gtechniq L1 Nanotech coating", "$50 per seat"],
  },
  {
    id: "steam",
    name: "Interior Steam Cleaning",
    from: 50,
    priceText: "Starting from $50",
    booking: "Booking required",
    photo: "/photos/slide-6.jpg",
    photoAlt: "Staff steam-cleaning a car interior",
    blurb: "Steam cleaning for interiors that need a deeper clean.",
    points: ["Deep interior clean", "Great after spills and kids"],
  },
  {
    id: "tint",
    name: "Window Tinting & Rain Protection",
    from: null,
    priceText: "Call for a quote",
    booking: "Call for a quote",
    photo: "/photos/gallery-14.jpg",
    photoAlt: "Black coupe after detailing",
    blurb:
      "Window tinting and rain protection programs — call for a quote for your car.",
    points: ["Window tinting", "Rain protection programs"],
  },
];

// 19-item A La Carte menu, exactly as published on the Major Detail page.
export const addOns = [
  { name: "Air Freshener Spray", price: "$2.00" },
  { name: "Boot Vacuum", price: "From $4.00" },
  { name: "Tyre Shine", price: "$4.00" },
  { name: "Plastic / Rubber Floor Mats Wash", price: "$4.00" },
  { name: "Floor Mat(s) Shampoo & Steam Clean", price: "From $10.00 per mat" },
  { name: "Dashboard & Console Detail & Dressing", price: "$12.00" },
  { name: "Tar Removal", price: "From $20.00" },
  { name: "Acid Rain Marks on Glass Corrected", price: "From $20.00 per panel" },
  { name: "Interior Vacuum", price: "From $30.00" },
  { name: "Super Shine Hand Sealant (Gtechniq C2 Liquid Crystal)", price: "$30.00" },
  { name: "Hand Wax (AutoGlym Aqua Wax)", price: "$35.00" },
  { name: "Sap Removal", price: "From $40.00" },
  { name: "Trim Rejuvenation", price: "From $40.00" },
  { name: "Clay Bar Paint Cleansing", price: "From $40.00" },
  { name: "Seat Shampoo & Steam Clean", price: "From $50.00 per seat" },
  { name: "Leather Seat Deep Cleaning & Rejuvenation (Gtechniq L1 Nanotech)", price: "$50.00 per seat" },
  { name: "Machine Polishing", price: "From $250.00" },
  { name: "Decal Removal", price: "P.O.A." },
  { name: "While-you-wait surcharge — large cars, 4WDs, people movers & 7-seaters", price: "+$4.00" },
];

export const promos = [
  { title: "Get $30 Hand Wax with any of our car washes", note: "Add a hand wax to any wash." },
  { title: "You save $12.50", note: "On The Works Mini Detail." },
  { title: "VIP & Annual Pass loyalty programs", note: "Ask in store for details." },
];

export const products = [
  {
    name: "Gtechniq Crystal Serum",
    text: "Flagship ceramic paint protection coating — the heart of our new-car treatment.",
  },
  {
    name: "Gtechniq C2 Liquid Crystal",
    text: "Hand sealant with 4 months of paint protection. In the Superior Mini Detail, or $30 as an add-on.",
  },
  {
    name: "Gtechniq L1 Nanotech",
    text: "Leather deep cleaning & rejuvenation — $50 per seat.",
  },
  {
    name: "AutoGlym Autogloss Rinse",
    text: "The standard finishing rinse in every Splash SUPERWASH.",
  },
  {
    name: "AutoGlym Aqua Wax",
    text: "Hand wax treatment — $35, or $30 with any car wash.",
  },
  {
    name: "100% Spring Water",
    text: "Your car is washed in 100% spring water and hand dried with 4 clean salon-quality microterry towels.",
  },
];

export const gallery = [
  { src: "/photos/hero.jpg", alt: "Red classic Porsche 911 in the Splash studio with Gtechniq signage", caption: "In the studio — Gtechniq Crystal Serum" },
  { src: "/photos/gallery-16.jpg", alt: "Red Porsche GT3 RS after detailing", caption: "Porsche GT3 RS" },
  { src: "/photos/gallery-3.jpg", alt: "Black McLaren with doors up", caption: "McLaren" },
  { src: "/photos/gallery-4.jpg", alt: "Black McLaren at the Splash shopfront", caption: "At the shopfront, Glen Osmond" },
  { src: "/photos/gallery-12.jpg", alt: "Black Toyota LandCruiser after a wash", caption: "LandCruiser" },
  { src: "/photos/gallery-14.jpg", alt: "Black coupe after detailing", caption: "Fresh from the bay" },
  { src: "/photos/gallery-2.jpg", alt: "Porsche interior in red leather", caption: "Red leather interior" },
  { src: "/photos/gallery-17.jpg", alt: "Red and black sports car interior", caption: "Sports interior" },
  { src: "/photos/gallery-10.jpg", alt: "Bentley interior, cream leather", caption: "Bentley interior" },
  { src: "/photos/interior.jpg", alt: "Luxury car interior after a deep clean", caption: "Deep clean interior" },
  { src: "/photos/wash.jpg", alt: "Staff hand-wiping a blue sedan", caption: "Hand wash, by hand" },
  { src: "/photos/slide-1.jpg", alt: "Staff polishing a black car", caption: "Machine polishing" },
  { src: "/photos/slide-6.jpg", alt: "Staff detailing a car in the workshop", caption: "In the workshop" },
  { src: "/photos/gallery-9.jpg", alt: "Hand polishing a car panel with a cloth", caption: "The finishing touch" },
  { src: "/photos/gallery-6.jpg", alt: "Grey sports car, detailed paintwork", caption: "Paintwork up close" },
  { src: "/photos/wheels.jpg", alt: "Detailed wheel and brake close-up", caption: "Wheels, done properly" },
  { src: "/photos/protection.jpg", alt: "Gtechniq product being applied to a Porsche bonnet", caption: "Gtechniq C2 on the bonnet" },
  { src: "/photos/slide-7.jpg", alt: "Grey Porsche after ceramic treatment", caption: "Ceramic finish" },
];

export const shopPhotos = [
  { src: "/photos/street-3399.jpg", alt: "Splash Car Wash & Detailing shopfront on Glen Osmond Road", caption: "The shopfront — 395 Glen Osmond Rd (Street View, July 2025)" },
  { src: "/photos/street-3398.jpg", alt: "Splash wash bays with a white Audi out front", caption: "The wash bays (Street View, July 2025)" },
  { src: "/photos/street-3396.jpg", alt: "Staff washing a car in the Splash wash bay", caption: "At work in the bays (Street View, October 2025)" },
];

export const giftCard = {
  title: "Splash Gift Card",
  text: "The perfect gift to make anybody's car look like brand new.",
  note: "Call 08 8379 7700 to arrange a gift card.",
};

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services & Prices" },
  { id: "protection", label: "Paint Protection" },
  { id: "gallery", label: "Gallery" },
  { id: "visit", label: "Visit Us" },
  { id: "faq", label: "FAQ" },
];

// How a visit works — from the DNA only (drive in, hand wash, coffee).
export const howItWorks = [
  {
    n: "1",
    title: "Drive in",
    text: "No booking needed for a Superwash or The Works — just drive in, 7 days a week.",
  },
  {
    n: "2",
    title: "We hand wash",
    text: "Your car is washed by hand in 100% spring water and dried with clean microterry towels.",
  },
  {
    n: "3",
    title: "Relax, coffee in hand",
    text: "Relax with a coffee while our staff pamper your vehicle — then drive away gleaming.",
  },
];

// FAQ — every answer comes from the DNA / this config only. Nothing invented.
export const faqs = [
  {
    q: "Do I need to book?",
    a: "No booking is needed for the Splash SUPERWASH ($28–$35) or The Works Mini Detail ($65–$75) — just drive in. Deep Clean, Superior Mini and Double Mini details are best booked, and Paint Protection, Machine Polishing and the other specialist treatments are by appointment. Call 08 8379 7700.",
  },
  {
    q: "How much is a wash?",
    a: "The Splash SUPERWASH exterior hand wash is $28 for a small car, $31 medium, $35 large — one price does it ALL, with no hidden surcharges for under-body spray, wheel cleaning or bug removal. Use the car-size picker on the Services page to see your car's price.",
  },
  {
    q: "Where are you, and when are you open?",
    a: "395 Glen Osmond Road, Glen Osmond SA 5064. Monday to Saturday 8:00am–5:00pm, Sunday 9:00am–4:00pm — open 7 days.",
  },
  {
    q: "What is Gtechniq Crystal Serum, and how much is it?",
    a: "Our flagship ceramic paint protection coating for new cars — a cost-saving alternative to dealership protection. Starting from $995, by appointment. Call 08 8379 7700 for warranty details.",
  },
  {
    q: "What products do you use?",
    a: "Named commercial-grade products: Gtechniq Crystal Serum, C2 Liquid Crystal and L1 Nanotech, AutoGlym Autogloss Rinse and Aqua Wax — and your car is washed in 100% spring water.",
  },
  {
    q: "Do you sell gift cards?",
    a: "Yes — a Splash Gift Card is the perfect gift to make anybody's car look like brand new. Call 08 8379 7700 to arrange one.",
  },
];
