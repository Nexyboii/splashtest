// Splash Car Wash & Detailing — rebuild preview (call-only booking).
// Content rules enforced in src/config.js: verified facts + proposed prices
// only; no invented inclusions, reviews, warranty years, or booking links.
import React, { useEffect } from "react";
import { site, booking, pricesProposed, paintProtection, reviews, photos } from "./config.js";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Splash+Car+Wash+%26+Detailing%2C+395+Glen+Osmond+Rd%2C+Glen+Osmond+SA+5064";

function fmt(v) {
  return typeof v === "number" ? `$${v.toFixed(2)}` : `$${v}`;
}

function Stars({ n }) {
  return <span className="stars" aria-label={`${n} out of 5 stars`}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

export default function App() {
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
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a className="brand" href="#top">SPLASH<span> · CAR WASH &amp; DETAILING</span></a>
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
        <div className="wrap hero-copy">
          <p className="eyebrow">Hand car wash · Glen Osmond, Adelaide · Since 2001</p>
          <h1>Your car, pampered by hand.</h1>
          <p className="hero-sub">
            Full-service hand car washing, paint protection &amp; detailing.
            From supercars to daily drivers — we treat every car with the
            utmost care &amp; attention.
          </p>
          <p className="promise">{site.promise}</p>
          <div className="hero-ctas">
            <a className="call-btn big" href={site.phoneHref}>Call {site.phoneDisplay}</a>
            <a className="ghost-btn big" href="#prices">See prices</a>
          </div>
          <p className="trust">
            <span>★ {reviews.rating} on Google · {reviews.countText}</span>
            <span>25 years serving Adelaide</span>
            <span>Open 7 days</span>
          </p>
        </div>
      </section>

      <main>
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
                    <td><strong>{p.name}</strong><span className="pkg-desc">{p.desc}</span></td>
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
              <img key={g} src={`/photos/${g}`} alt={`Splash Car Wash detailing work ${i + 1}`} loading="lazy" />
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
        <div className="wrap">
          <p><strong>SPLASH CAR WASH &amp; DETAILING</strong> · Serving Adelaide&apos;s cars since 2001</p>
          <p>{site.address} · <a href={site.phoneHref}>{site.phoneDisplay}</a> · <a href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
      </footer>

      <a className="sticky-call" href={site.phoneHref}>Call {site.phoneDisplay}</a>
    </div>
  );
}

// Referenced so the call-only decision stays visible in the bundle audit:
// booking.mode === "call-only" — no online booking link exists on this site.
void booking;
