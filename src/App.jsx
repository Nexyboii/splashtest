import React, { useEffect, useRef, useState } from "react";
import { site, booking, pricesProposed, paintProtection, reviews, photos } from "./config.js";
import WashScene from "./components/WashScene.jsx";

const fmt = (v) => (typeof v === "number" ? `$${v.toFixed(2)}` : `$${v}`);
const fmtInt = (v) => (typeof v === "number" ? `$${v}` : `$${v}`);

function Reveal({ children, className = "", id }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && el.classList.add("in")), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} id={id}>{children}</div>;
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

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null);
  const [closing, setClosing] = useState(false);

  // Fade the loading screen out once the app has mounted.
  useEffect(() => {
    const loader = document.getElementById("loader");
    if (!loader) return;
    const t = window.setTimeout(() => {
      loader.classList.add("done");
      window.setTimeout(() => loader.remove(), 700);
    }, 450);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <div className="splash">
      <header className={`topbar${scrolled ? " scrolled" : ""}`}>
        <div className="topbar-inner">
          <a className="brand" href="#top">
            <img className="brand-mark" src="/photos/logo-mark.jpg" alt="Splash Car Wash logo" />
            <span className="brand-text">Splash <span>Car Wash &amp; Detailing</span></span>
          </a>
          <nav className="topnav" aria-label="Main">
            <a href="#services">Services &amp; prices</a>
            <a href="#protection">Paint protection</a>
            <a href="#gallery">Our work</a>
            <a href="#visit">Visit us</a>
          </nav>
          <a className="call-btn head" href={site.phoneHref}>Call {site.phoneDisplay}</a>
        </div>
      </header>

      <WashScene />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <span key={n}>
              {["Hand wash only", "No brushes — no rollers — no brooms", "Purified water", "Gtechniq Crystal Serum", "Open 7 days", "Since 2001"].map((x) => <i key={x}>{x}</i>)}
            </span>
          ))}
        </div>
      </div>

      <main>
        <section className="wrap reveal" id="how">
          <p className="label">How it works</p>
          <h2>Simple. No booking. No fuss.</h2>
          <div className="how-grid">
            <div className="how-card anim open">
              <img src="/photos/logo-mark.jpg" alt="" width="44" height="44" loading="lazy" />
              <h3>Supers &amp; Minis</h3>
              <p><strong>Just drive in.</strong> No booking required — come in during opening hours.</p>
              <p className="fineprint">Super Wash · Mini Detail — no booking required.</p>
            </div>
            <div className="how-card anim">
              <h3>Deep Cleans &amp; Details</h3>
              <p><strong>Please call for booking.</strong> Details take real time, so we allow the right time for your car.</p>
              <p className="fineprint">Deep Clean · Superior Mini · Double Mini · Full Detail · Major Detail</p>
            </div>
          </div>
          <div className="water-strip">
            <div><strong>Purified water</strong><span>Pressure washed with purified water</span></div>
            <div><strong>Himalayan salt purification</strong><span>Softened water, gentle on paint</span></div>
            <div><strong>Spot-free rinse</strong><span>Pure-water rinse, no spots left behind</span></div>
          </div>
          <p className="promise">“No brushes. No rollers. No brooms. No scratches.”</p>
        </section>

        <section className="wrap reveal" id="services">
          <p className="label">Services &amp; prices</p>
          <h2>One honest price list.</h2>
          <p className="lede">One price does it all — no hidden extras. Prices are by vehicle size; tap any service to see exactly what it includes.</p>
          <div className="table-scroll">
            <table className="prices">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Small<br /><span>sedan / coupe</span></th>
                  <th>Medium<br /><span>SUV / wagon</span></th>
                  <th>Large<br /><span>4WD / large SUV</span></th>
                </tr>
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
                    <td data-label="Small sedan / coupe">{fmt(p.small)}</td>
                    <td data-label="Medium SUV / wagon">{fmt(p.medium)}</td>
                    <td data-label="Large 4WD / large SUV">{fmt(p.large)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="extras">
            <div className="extra-card anim">
              <h3>Hand wax</h3>
              <p>Hand wax {fmtInt(pricesProposed.handWax)}, or {fmtInt(pricesProposed.handWaxWithWash)} with any wash.</p>
            </div>
            <div className="extra-card anim">
              <h3>Machine polishing</h3>
              <p>Machine polishing from {fmtInt(pricesProposed.machinePolishingFrom)}. <span className="fineprint">Price to confirm — the live site lists $250 on one page and $380 on another.</span></p>
            </div>
            <div className="extra-card anim">
              <h3>Gift cards</h3>
              <p>Give a Splash gift card — the perfect present. Call us to arrange one.</p>
            </div>
          </div>
        </section>

        <section className="wrap reveal" id="major-detail">
          <div className="callout anim">
            <div>
              <p className="label">Major Detail</p>
              <h2>Ready for sale?</h2>
              <p className="lede">Want to beat the trade-in blues, or give your ride the birthday you&apos;ve been promising it? The same treatment we give luxury dealers&apos; new &amp; second-hand vehicles before sale — and a great way to recondition a car you love and want to keep.</p>
              <p className="fineprint">Not what cleaners, valets and body shop employees call &apos;detailing&apos; — this is undertaken by people who&apos;ve done it since 2001.</p>
              <p className="price-line">From <strong>$330</strong> for full interior detail</p>
              <button type="button" className="how-btn" onClick={openMajor}>See what&apos;s included</button>
              <a className="call-btn" href={site.phoneHref}>Call to discuss your car</a>
            </div>
            <img src={`/photos/${photos.gallery[2]}`} alt="McLaren with its doors open in front of the Splash workshop" loading="lazy" />
          </div>
        </section>

        <section className="wrap reveal" id="protection">
          <p className="label">Paint protection</p>
          <h2>New Car Treatment — Gtechniq Crystal Serum</h2>
          <div className="dark-card anim">
            <div>
              <p className="lede">The world&apos;s finest nanotechnology treatments for your vehicle&apos;s surfaces — applied by our trained staff, at a price that&apos;s truly affordable.</p>
              <ul className="chips">
                {paintProtection.points.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <ul className="includes">
                {paintProtection.includes.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <p className="price-line light">From <strong>{fmtInt(pricesProposed.paintProtectionFrom)}</strong></p>
              <p className="fineprint">Warranty details depend on your vehicle and the treatment chosen — call us and we&apos;ll explain the warranty for your car before you book.</p>
              <button type="button" className="how-btn light" onClick={openProtection}>See what&apos;s protected</button>
              <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
            </div>
            <img src={`/photos/${photos.gallery[17]}`} alt="Gtechniq Crystal Serum being applied to a car bonnet" loading="lazy" />
          </div>
        </section>

        <section className="wrap reveal" id="gallery">
          <p className="label">Our work</p>
          <h2>Real cars. Real results.</h2>
          <div className="gallery">
            {photos.gallery.map((f, i) => (
              <figure key={f} className="anim">
                <img src={`/photos/${f}`} alt={`Splash Car Wash work — photo ${i + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <section className="wrap reveal" id="reviews">
          <p className="label">Reviews</p>
          <h2>Loved by Adelaide drivers</h2>
          <p className="stars" aria-label={`Rated ${reviews.rating} out of 5 stars`}><span className="big-stars">★★★★</span><span className="big-stars dim">★</span> <strong>{reviews.rating}★</strong> from {reviews.count}</p>
          <div className="quotes">
            {reviews.quotes.map((q) => (
              <blockquote key={q.text} className="anim">
                <p>“{q.text}”</p>
                <cite>— {q.author}</cite>
              </blockquote>
            ))}
          </div>
          <p><a href={reviews.allUrl} target="_blank" rel="noreferrer">Read all reviews →</a></p>
        </section>

        <section className="wrap reveal" id="gift">
          <div className="gold-card anim">
            <div>
              <h2>A gift that gleams.</h2>
              <p>Give someone a Splash gift card — the perfect present for the driver who has everything.</p>
              <a className="call-btn" href={site.phoneHref}>Call to arrange a gift card</a>
            </div>
          </div>
        </section>

        <section className="wrap reveal" id="visit">
          <p className="label">Visit us</p>
          <h2>Come and see us.</h2>
          <div className="visit-grid">
            <div className="anim">
              <p><strong>{site.address}</strong></p>
              <p>Entry via the side street — {site.entry}</p>
              <p><a href={site.directionsUrl} target="_blank" rel="noreferrer">Get directions →</a></p>
              <p className="hours"><strong>Hours</strong><br />Mon–Sat {site.hours[0].time}<br />Sun {site.hours[1].time}</p>
            </div>
            <div className="anim">
              <p><strong>Call us</strong><br /><a href={site.phoneHref}>{site.phoneDisplay}</a></p>
              <p><strong>Email</strong><br /><a href={`mailto:${site.email}`}>{site.email}</a></p>
              <p className="fineprint">Est. 2001 — South Australia&apos;s home of hand car washing and detailing.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <img className="footer-logo" src="/photos/logo.jpg" alt="Splash Car Wash & Detailing logo" loading="lazy" />
          <p><strong>Splash Car Wash &amp; Detailing</strong> — {site.address}. Open 7 days: Mon–Sat {site.hours[0].time}, Sun {site.hours[1].time}.</p>
          <p><a href={site.phoneHref}>{site.phoneDisplay}</a> · <a href={`mailto:${site.email}`}>{site.email}</a></p>
          <p className="fineprint">Hand car wash &amp; detailing in Adelaide since 2001. No online booking — call or just drive in.</p>
          <a className="call-btn" href={site.phoneHref}>Call {site.phoneDisplay}</a>
        </div>
      </footer>

      <a className="sticky-call" href={site.phoneHref}>Call {site.phoneDisplay}</a>

      {modal ? <ServiceModal content={modal} closing={closing} onClose={closeModal} /> : null}
    </div>
  );
}
