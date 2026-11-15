// Splash Car Wash & Detailing — rebuild preview (call-only booking).
// Content rules enforced in src/config.js: verified facts + proposed prices
// only; no invented inclusions, reviews, warranty years, or booking links.
// Motion pass 2026-11-15: logo, floating-bubble hero, staggered entrances,
// marquee, hover-lift cards, shine-sweep call buttons.
import React, { useEffect, useRef, useState } from "react";
import { site, booking, pricesProposed, paintProtection, reviews, photos, journey } from "./config.js";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Splash+Car+Wash+%26+Detailing%2C+395+Glen+Osmond+Rd%2C+Glen+Osmond+SA+5064";

const MARQUEE_ITEMS = [
  "Hand Wash", "Ceramic Coating", "Paint Protection", "Full Detailing",
  "Machine Polishing", "Interior Deep Clean", "Mini Detail", "Leather Care",
];

function fmt(v) {
  return typeof v === "number" ? `$${v.toFixed(2)}` : `$${v}`;
}

function Stars({ n }) {
  return <span className="stars" aria-label={`${n} out of 5 stars`}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

function Bubbles() {
  return (
    <div className="bubbles" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => <span key={i} className={`bubble b${i + 1}`} />)}
    </div>
  );
}

// Service popup — smooth open, steps animate in one by one along a rail.
function ServiceModal({ content, closing, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className={`modal-backdrop${closing ? " closing" : ""}`} onClick={onClose}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-label={content.title} onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <p className="label">{content.eyebrow}</p>
        <h2>{content.title}</h2>
        <p className="lede">{content.desc}</p>
        {content.chips && (
          <ul className="chips modal-chips">
            {content.chips.map((c) => <li key={c}>{c}</li>)}
          </ul>
        )}
        {content.steps ? (
          <ol className="modal-steps">
            {content.steps.map((s, i) => (
              <li key={s.title} className="mstep" style={{ "--d": `${0.18 + i * 0.09}s` }}>
                <span className="mstep-num">{String(i + 1).padStart(2, "0")}</span>
                <div><strong>{s.title}</strong>{s.text ? <span>{s.text}</span> : null}</div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="modal-note">{content.note}</p>
        )}
        {content.steps && content.note ? <p className="modal-note">{content.note}</p> : null}
        <div className="modal-foot">
          <p className="modal-price">{content.priceLine}</p>
          <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
        </div>
        <p className="fineprint">{content.book === "walk-in" ? "Or just drive in during opening hours — no booking needed." : "Please call to book — we allow the right time for your car."}</p>
      </div>
    </div>
  );
}

// Scroll journey — pinned photo crossfades through the wash stages as
// the customer scrolls. Falls back to a plain stacked list under
// prefers-reduced-motion (see CSS).
function Journey() {
  const ref = useRef(null);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setStage(Math.min(journey.length - 1, Math.floor(p * journey.length)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return (
    <section className="journey" ref={ref} style={{ height: `${journey.length * 90}vh` }} aria-label="The Splash wash journey — from dusty to dazzling">
      <div className="journey-pin">
        {journey.map((s, i) => (
          <figure key={s.photo} className={`journey-stage${i === stage ? " active" : ""}`}>
            <img src={`/photos/${s.photo}`} alt={s.title} />
            <figcaption>
              <span className="journey-count">Step {i + 1} of {journey.length}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </figcaption>
          </figure>
        ))}
        <div className="journey-progress" aria-hidden="true"><span style={{ width: `${((stage + 1) / journey.length) * 100}%` }} /></div>
        <p className="journey-hint" aria-hidden="true">Keep scrolling ↓</p>
      </div>
    </section>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null);
  const [closing, setClosing] = useState(false);

  const closeModal = () => {
    setClosing(true);
    window.setTimeout(() => { setModal(null); setClosing(false); }, 240);
  };
  const openPackage = (p) => setModal({
    eyebrow: p.book === "walk-in" ? "Walk in — no booking" : "Call to book",
    title: p.name,
    desc: p.desc,
    steps: p.steps,
    note: p.note || null,
    book: p.book,
    priceLine: p.small === p.medium && p.medium === p.large
      ? `${fmt(p.small)} · all sizes`
      : `Small ${fmt(p.small)} · Medium ${fmt(p.medium)} · Large ${fmt(p.large)}`,
  });
  const openMajor = () => setModal({
    eyebrow: "Call to book",
    title: "Major Detail — ready for sale",
    desc: "Want to beat the trade-in blues, or give your ride the birthday you've been promising it? The same treatment we give luxury dealers' new & second-hand vehicles before sale — and a great way to recondition a car you love and want to keep.",
    steps: null,
    note: "From $330 for full interior detail — call to discuss your car.",
    book: "call",
    priceLine: "From $330",
  });
  const openProtection = () => setModal({
    eyebrow: "Paint protection",
    title: "New Car Treatment — Gtechniq Crystal Serum",
    desc: "The world's finest nanotechnology treatments for your vehicle's surfaces — applied by our trained staff, at a price that's truly affordable.",
    chips: paintProtection.points,
    steps: paintProtection.includes.map((name) => ({ title: name, text: "" })),
    note: "Warranty details depend on your vehicle and the treatment chosen — call us and we'll explain the warranty for your car before you book.",
    book: "call",
    priceLine: `From $${pricesProposed.paintProtectionFrom}`,
  });
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="splash">
      <header className={`topbar${scrolled ? " scrolled" : ""}`}>
        <div className="wrap topbar-inner">
          <a className="brand" href="#top">
            <span className="brand-mark"><img src={photos.logoMark} alt="" /></span>
            <span className="brand-text">SPLASH<span>CAR WASH &amp; DETAILING</span></span>
          </a>
          <nav className="nav" aria-label="Sections">
            <a href="#prices">Prices</a>
            <a href="#protection">Paint Protection</a>
            <a href="#gallery">Gallery</a>
            <a href="#reviews">Reviews</a>
            <a href="#visit">Visit</a>
          </nav>
          <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
        </div>
      </header>

      <section className="hero" id="top">
        <img className="hero-img" src={photos.hero} alt="Red Porsche detailed in the Splash studio" fetchpriority="high" />
        <div className="hero-shade" />
        <Bubbles />
        <div className="wrap hero-copy">
          <div className="hero-badge anim" style={{ "--d": "0s" }}>
            <img src={photos.logo} alt="Splash Car Wash & Detailing logo" />
          </div>
          <p className="eyebrow anim" style={{ "--d": "0.1s" }}>Hand car wash · Glen Osmond, Adelaide · Since 2001</p>
          <h1 className="anim" style={{ "--d": "0.22s" }}>Your car, <em>pampered</em> by hand.</h1>
          <p className="hero-sub anim" style={{ "--d": "0.34s" }}>
            Full-service hand car washing, paint protection &amp; detailing.
            From supercars to daily drivers — we treat every car with the
            utmost care &amp; attention.
          </p>
          <p className="promise anim" style={{ "--d": "0.44s" }}>{site.promise}</p>
          <div className="hero-ctas anim" style={{ "--d": "0.54s" }}>
            <a className="call-btn big" href={site.phoneHref}>Call {site.phoneDisplay}</a>
            <a className="ghost-btn big" href="#prices">See prices</a>
          </div>
          <p className="trust anim" style={{ "--d": "0.66s" }}>
            <span>★ {reviews.rating} on Google · {reviews.countText}</span>
            <span>25 years serving Adelaide</span>
            <span>Open 7 days</span>
          </p>
        </div>
        <a className="scroll-cue" href="#how" aria-label="Scroll down to see how it works">
          <span>Scroll</span><i aria-hidden="true">↓</i>
        </a>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <span key={n}>{MARQUEE_ITEMS.map((it) => `${it}  ✦  `).join("")}</span>
          ))}
        </div>
      </div>

      <main>
        <Journey />
        <section className="wrap reveal" id="how">
          <p className="label">How it works</p>
          <h2>Wash or detail — in two ways</h2>
          <div className="two-col">
            <article className="card">
              <h3>No booking required — just drive in</h3>
              <p>For a Super Wash or a Mini Detail, just come in during opening hours. We&apos;ll look after your car while you relax with a coffee.</p>
              <p className="card-note">Mon–Sat 8:00 AM – 5:00 PM · Sun 9:00 AM – 4:00 PM</p>
            </article>
            <article className="card dark">
              <h3>Please call for booking</h3>
              <p>Details, paint protection, machine polishing and the Major Detail need a booking, so we can allow the right time for your car.</p>
              <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
            </article>
          </div>
          <ol className="steps">
            <li><strong>Call or drive in</strong><span>Walk in for a wash, call for a detail.</span></li>
            <li><strong>We wash &amp; detail by hand</strong><span>Microfibre mitt wash, touch-free rinse &amp; wax.</span></li>
            <li><strong>Drive away gleaming</strong><span>That&apos;s the Splash difference.</span></li>
          </ol>
        </section>

        <section className="wrap reveal" id="prices">
          <p className="label">Services &amp; prices</p>
          <h2>One clear price list</h2>
          <p className="lede">One price does it all — no hidden extras for under-body spray, properly cleaning wheels, or bug removal.</p>
          <div className="table-scroll">
            <table className="prices">
              <thead>
                <tr><th>Package</th><th>Small sedan</th><th>Medium SUV</th><th>Large SUV &amp; 7-seater</th></tr>
              </thead>
              <tbody>
                {pricesProposed.packages.map((p) => (
                  <tr key={p.name}>
                    <td>
                      <strong>{p.name}</strong>
                      <span className="pkg-desc">{p.desc}</span>
                      <span className={`book-chip ${p.book}`}>{p.book === "walk-in" ? "Walk in — no booking" : "Call to book"}</span>
                      <button type="button" className="how-btn" onClick={() => openPackage(p)}>See how it works →</button>
                    </td>
                    <td>{fmt(p.small)}</td>
                    <td>{fmt(p.medium)}</td>
                    <td>{fmt(p.large)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fineprint">Prices may vary for extra-dirty vehicles — we will always confirm with you first. Extra dirty cars may need to be seen first and booked in.</p>

          <h3 className="subhead">Specialist services</h3>
          <div className="two-col">
            <article className="card">
              <h3>Major Detail — ready for sale</h3>
              <p>Want to beat the trade-in blues, or give your ride the birthday you&apos;ve been promising it? The same treatment we give luxury dealers&apos; new &amp; second-hand vehicles before sale — and a great way to recondition a car you love and want to keep.</p>
              <p className="price-line">From <strong>$330</strong> for full interior detail</p>
              <button type="button" className="how-btn" onClick={openMajor}>See what&apos;s included</button>
              <a className="call-btn" href={site.phoneHref}>Call to discuss your car</a>
            </article>
            <article className="card">
              <h3>Extras</h3>
              <ul className="extras">
                <li><span>Machine polishing</span><strong>from $380</strong></li>
                <li><span>Hand wax with AutoGlym Aqua Wax</span><strong>$35</strong></li>
                <li><span>Hand wax with any wash</span><strong>$30</strong></li>
                <li><span>Super Shine hand sealant, Gtechniq C2 Liquid Crystal</span><strong>$30</strong></li>
                <li><span>Leather seat deep clean &amp; rejuvenation, Gtechniq L1</span><strong>$50 / seat</strong></li>
                <li><span>Seat shampoo &amp; steam clean</span><strong>from $50 / seat</strong></li>
                <li><span>Clay bar paint cleansing</span><strong>from $40</strong></li>
                <li><span>Interior vacuum</span><strong>from $30</strong></li>
                <li><span>Tyre shine</span><strong>$4</strong></li>
              </ul>
              <p className="fineprint">More extras in store — tar removal, sap removal, trim rejuvenation and more from $20. Ask us when you call.</p>
            </article>
          </div>
        </section>

        <section className="dark-section reveal" id="protection">
          <div className="wrap">
            <p className="label light">Paint protection</p>
            <h2>New Car Treatment — {paintProtection.product}</h2>
            <p className="lede light">The world&apos;s finest nanotechnology treatments for your vehicle&apos;s surfaces — applied by our trained staff, at a price that&apos;s truly affordable.</p>
            <ul className="chips">
              {paintProtection.points.map((pt) => <li key={pt}>{pt}</li>)}
            </ul>
            <div className="two-col">
              <div>
                <h3 className="subhead light">Total surface protection</h3>
                <ul className="ticklist">
                  {paintProtection.includes.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </div>
              <article className="card">
                <h3>Protect your new car properly</h3>
                <p>Paint protection guards your new car against chemical and ultraviolet damage — and we can also advise on protecting high wear-and-tear areas with Paint Protection Film.</p>
                <p className="price-line">From <strong>${pricesProposed.paintProtectionFrom}</strong></p>
                <p className="fineprint">Warranty details depend on your vehicle and the treatment chosen — call us and we&apos;ll explain the warranty for your car before you book.</p>
                <button type="button" className="how-btn light" onClick={openProtection}>See what&apos;s protected</button>
                <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
              </article>
            </div>
          </div>
        </section>

        <section className="wrap reveal" id="gallery">
          <p className="label">Our work</p>
          <h2>From supercars to daily drivers</h2>
          <div className="gallery">
            {photos.gallery.map((g, i) => (
              <figure className="g-item" key={g}>
                <img src={`/photos/${g}`} alt={`Splash Car Wash detailing work ${i + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <section className="wrap reveal" id="reviews">
          <p className="label">Reviews</p>
          <h2>Adelaide keeps coming back</h2>
          <p className="rating-line"><span className="big-stars">★ {reviews.rating}</span> on Google · {reviews.countText}</p>
          <div className="two-col">
            {reviews.quotes.map((q) => (
              <blockquote className="card quote" key={q.source}>
                <Stars n={q.stars} />
                <p>“{q.text}”</p>
                <footer>— {q.source}</footer>
              </blockquote>
            ))}
          </div>
          <p><a className="text-link" href={reviews.allReviewsUrl} target="_blank" rel="noreferrer">Read all reviews</a></p>
        </section>

        <section className="wrap reveal" id="gift">
          <article className="card gift">
            <h2>Gift cards</h2>
            <p>The perfect gift to make anybody&apos;s car look brand new. Call us and we&apos;ll arrange a gift card for any of our washes or details.</p>
            <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
          </article>
        </section>

        <section className="wrap reveal" id="visit">
          <p className="label">Visit us</p>
          <h2>Come and see us</h2>
          <div className="two-col">
            <div>
              <p><strong>{site.address}</strong></p>
              <p><a className="text-link" href={MAPS_URL} target="_blank" rel="noreferrer">Get directions on Google Maps</a></p>
              <p><a href={site.phoneHref}>{site.phoneDisplay}</a><br /><a href={`mailto:${site.email}`}>{site.email}</a></p>
              <p>Entry via side street. Close to the start of the South Eastern Freeway.</p>
            </div>
            <table className="hours">
              <tbody>
                {site.hours.map((h) => (
                  <tr key={h.days}><th>{h.days}</th><td>{h.time}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <img src={photos.logo} alt="Splash Car Wash & Detailing logo" />
          </div>
          <div>
            <p><strong>SPLASH CAR WASH &amp; DETAILING</strong> · Serving Adelaide&apos;s cars since 2001</p>
            <p>{site.address} · <a href={site.phoneHref}>{site.phoneDisplay}</a> · <a href={`mailto:${site.email}`}>{site.email}</a></p>
            <p className="footer-nav"><a href="#prices">Prices</a> · <a href="#protection">Paint Protection</a> · <a href="#gallery">Gallery</a> · <a href="#reviews">Reviews</a> · <a href="#visit">Visit</a></p>
          </div>
        </div>
      </footer>

      <a className="sticky-call" href={site.phoneHref}>Call {site.phoneDisplay}</a>

      {modal ? <ServiceModal content={modal} closing={closing} onClose={closeModal} /> : null}
    </div>
  );
}

// Referenced so the call-only decision stays visible in the bundle audit:
// booking.mode === "call-only" — no online booking link exists on this site.
void booking;
