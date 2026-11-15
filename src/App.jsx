import React, { useEffect, useRef, useState } from 'react'
import {
  business,
  pillars,
  trustChips,
  packages,
  specialists,
  addOns,
  promos,
  products,
  gallery,
  shopPhotos,
  giftCard,
  navLinks,
  howItWorks,
  faqs,
  sizeExamples,
  compareFeatures,
} from './config.js'

/* ---------- hash routing ---------- */
const ROUTES = ['home', 'services', 'protection', 'gallery', 'visit', 'faq']

/* ---------- car-size price picker ---------- */
const SIZES = [
  { id: 'small', label: 'Small car' },
  { id: 'medium', label: 'Medium car' },
  { id: 'large', label: 'Large car' },
]

function SizePicker({ size, onChange }) {
  return (
    <>
      <div className="picker" role="group" aria-label="Choose your car size to see its price">
        <span className="picker-label">My car is a…</span>
        {SIZES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`pill${size === s.id ? ' active' : ''}`}
            aria-pressed={size === s.id}
            onClick={() => onChange(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="picker-hint">
        {SIZES.find((s) => s.id === size).label}: {sizeExamples[size]}. Not sure? Call us — we&rsquo;ll
        tell you over the phone.
      </p>
    </>
  )
}

/* ---------- package comparison table (published data only) ---------- */
const SHORT_NAMES = {
  superwash: 'SUPERWASH',
  works: 'The Works',
  deepclean: 'Deep Clean',
  superior: 'Superior',
  double: 'Double Mini',
  major: 'Major',
}

function comparePrice(p) {
  if (p.prices) return `$${p.prices.small}`
  if (p.priceNote) return 'From $330'
  return 'Call for price'
}

function CompareTable() {
  return (
    <div className="table-scroll">
      <table className="compare">
        <thead>
          <tr>
            <th scope="col">Compare packages</th>
            {packages.map((p) => (
              <th key={p.id} scope="col">{SHORT_NAMES[p.id] || p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Price (small car)</th>
            {packages.map((p) => (
              <td key={p.id} className="c-price">{comparePrice(p)}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Booking</th>
            {packages.map((p) => (
              <td key={p.id}>{p.booking === 'No booking required' ? 'Just drive in' : 'Book a time'}</td>
            ))}
          </tr>
          {compareFeatures.map((f) => (
            <tr key={f.label}>
              <th scope="row">{f.label}</th>
              {packages.map((p) => {
                const v = f.values[p.id]
                return v === 'yes' ? (
                  <td key={p.id} className="yes">✓</td>
                ) : (
                  <td key={p.id} className="no">—</td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-note">✓ = included. — = not listed for that package (ask us — most extras can be added).</p>
    </div>
  )
}
function routeFromHash() {
  const h = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0]
  return ROUTES.includes(h) ? h : 'home'
}
function hrefFor(id) {
  return id === 'home' ? '#/' : `#/${id}`
}

/* ---------- scroll reveal (shared observer + timeout fallback) ---------- */
function Reveal({ children, className }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('reveal')
    const t = window.setTimeout(() => el.classList.add('in'), 900)
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in')
      return () => window.clearTimeout(t)
    }
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            ob.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    ob.observe(el)
    return () => {
      window.clearTimeout(t)
      ob.disconnect()
    }
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* ---------- shared bits ---------- */
function CallButton({ className, label }) {
  return (
    <a className={`btn btn-call ${className || ''}`} href={business.phoneHref} aria-label={`Call Splash Car Wash on ${business.phoneDisplay}`}>
      <span className="phone-ic" aria-hidden="true">☎</span> {label || `Call ${business.phoneDisplay}`}
    </a>
  )
}

function PriceFrom({ item, size }) {
  if (item.prices && size && item.prices[size] != null) {
    const label = SIZES.find((s) => s.id === size)
    return (
      <span className="price-from">
        ${item.prices[size]}
        <small>
          {label ? label.label : ''} · {item.sub || ''}
        </small>
      </span>
    )
  }
  if (item.from != null) {
    return (
      <span className="price-from">
        From ${item.from}
        <small>{item.sub || ''}</small>
      </span>
    )
  }
  if (item.priceNote) return <span className="price-from">{item.priceNote}</span>
  if (item.priceText) return <span className="price-from">{item.priceText}</span>
  return <span className="price-from">Call for price</span>
}

function BookingPill({ booking }) {
  const needsCall = booking !== 'No booking required'
  return <span className={`booking-pill${needsCall ? ' call' : ''}`}>{booking}</span>
}

function ServiceCard({ item, kind, onOpen, size }) {
  const tagBlue = (item.tag || '').includes('Gtechniq')
  return (
    <article className="card">
      <div className="card-photo">
        <img src={item.photo} alt={item.photoAlt} loading="lazy" />
        {item.tag ? <span className={`card-tag${tagBlue ? ' blue' : ''}`}>{item.tag}</span> : null}
      </div>
      <div className="card-body">
        <span className="card-sub">{item.sub || item.booking}</span>
        <h3>{item.name}</h3>
        <p>{item.blurb}</p>
        <div className="price-row">
          <PriceFrom item={item} size={size} />
          <BookingPill booking={item.booking} />
        </div>
        <div className="card-actions">
          <button type="button" className="btn btn-navy" onClick={() => onOpen(item, kind)}>
            What&rsquo;s included
          </button>
          <a className="btn btn-outline" href={business.phoneHref}>
            Call
          </a>
        </div>
      </div>
    </article>
  )
}

/* ---------- service modal ---------- */
function ServiceModal({ item, kind, onClose }) {
  const list = item.steps || item.includes || item.points || []
  const listTitle = item.steps ? 'The 9-step process' : kind === 'package' ? "What's included" : 'What you get'
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top">
          <div>
            <h3>{item.name}</h3>
            <p className="sub">{item.sub || item.booking}</p>
          </div>
          <button type="button" className="modal-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-scroll">
        <div className="modal-photo">
          <img src={item.photo} alt={item.photoAlt} />
        </div>
        <p className="modal-blurb">{item.blurb}</p>
        {item.prices ? (
          <div className="price-table" aria-label="Prices">
            <div className="row">
              <span>Small car</span>
              <b>${item.prices.small}</b>
            </div>
            <div className="row">
              <span>Medium car</span>
              <b>${item.prices.medium}</b>
            </div>
            <div className="row">
              <span>Large car</span>
              <b>${item.prices.large}</b>
            </div>
          </div>
        ) : item.priceNote ? (
          <p className="price-note">{item.priceNote}</p>
        ) : item.priceText ? (
          <p className="price-note">{item.priceText}</p>
        ) : (
          <p className="price-note">Call for price</p>
        )}
        {item.addOnText ? <p className="addon-note">{item.addOnText}</p> : null}
        {list.length > 0 ? (
          <>
            <h4 style={{ marginTop: 20, fontFamily: 'var(--font-head)', fontSize: 16 }}>{listTitle}</h4>
            <ul className="modal-list">
              {list.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        ) : null}
        <p className="modal-book">
          <strong>{item.booking}.</strong> {item.bookingNote || ''}
        </p>
        </div>
        <div className="modal-foot">
          <CallButton label={`Call ${business.phoneDisplay}`} />
        </div>
      </div>
    </div>
  )
}

/* ---------- gallery lightbox ---------- */
function Lightbox({ items, index, onClose, onNav }) {
  const item = items[index]
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNav])
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption} onClick={onClose}>
      <button type="button" className="lb-btn lb-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <button
        type="button"
        className="lb-btn lb-prev"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation()
          onNav(-1)
        }}
      >
        ‹
      </button>
      <img src={item.src} alt={item.alt} onClick={(e) => e.stopPropagation()} />
      <figcaption>{item.caption}</figcaption>
      <button
        type="button"
        className="lb-btn lb-next"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation()
          onNav(1)
        }}
      >
        ›
      </button>
    </div>
  )
}

/* ---------- nav + footer ---------- */
function Nav({ route }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header>
      <div className="topbar">
        <div className="wrap">
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <span className="hours">{business.hoursShort}</span>
        </div>
      </div>
      <nav className="nav" aria-label="Main navigation">
        <div className="wrap nav-inner">
          <a className="brand" href="#/" onClick={close} aria-label="Splash Car Wash & Detailing — home">
            <img className="brand-logo" src={business.logo} alt="Splash Car Wash logo" />
            <span>
              <span className="brand-name">Splash</span>
              <br />
              <span className="brand-sub">Car Wash &amp; Detailing</span>
            </span>
          </a>
          <div className="nav-links">
            {navLinks.map((l) => (
              <a key={l.id} href={hrefFor(l.id)} className={route === l.id ? 'active' : ''} aria-current={route === l.id ? 'page' : undefined}>
                {l.label}
              </a>
            ))}
          </div>
          <a className="btn btn-call btn-sm nav-call" href={business.phoneHref}>
            <span className="phone-ic" aria-hidden="true">☎</span> {business.phoneDisplay}
          </a>
          <button
            type="button"
            className={`menu-btn${open ? ' open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={`mobile-menu${open ? ' open' : ''}`}>
          {navLinks.map((l) => (
            <a key={l.id} href={hrefFor(l.id)} className={route === l.id ? 'active' : ''} onClick={close}>
              {l.label}
            </a>
          ))}
          <a className="btn btn-call" href={business.phoneHref}>
            <span className="phone-ic" aria-hidden="true">☎</span> Call {business.phoneDisplay}
          </a>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <img className="footer-logo" src={business.logo} alt="Splash Car Wash logo" />
            <h4>{business.name}</h4>
            <p>{business.tagline}</p>
            <p style={{ marginTop: 8 }}>{business.sinceText} · {business.yearsText}.</p>
          </div>
          <div>
            <h4>Visit us</h4>
            <ul>
              <li>{business.address}</li>
              <li>{business.hoursWeekday}</li>
              <li>{business.hoursSunday}</li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>
                Phone: <a href={business.phoneHref}>{business.phoneDisplay}</a>
              </li>
              <li>
                Email: <a href={`mailto:${business.email}`}>{business.email}</a>
              </li>
              <li>
                Web: <a href={`https://${business.website}`}>{business.website}</a>
              </li>
              <li>
                <a href={business.mapsUrl} target="_blank" rel="noreferrer">
                  Get directions on Google Maps →
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>{business.name} © 2026</span>
          <span>{business.addressShort}</span>
        </div>
      </div>
    </footer>
  )
}

function ReviewsSection() {
  return (
    <section className="section" aria-label="Google reviews">
      <div className="wrap">
        <Reveal>
          <div className="reviews-card">
            <div className="stars" aria-hidden="true">
              ★★★★★
            </div>
            <p className="reviews-big">
              {business.rating} / 5
            </p>
            <p>
              {business.reviewCount} {business.reviewSource} — customers rate the entry-level wash, the coffee
              while you wait, and the thoroughness on heavily soiled interiors and ceramic polishing.
            </p>
            <a className="btn btn-navy" href={business.googleReviewsUrl} target="_blank" rel="noreferrer">
              Read all reviews on Google
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- home (the hook) ---------- */
function HomeView({ onOpen, onLightbox, size, onSizeChange }) {
  const crystal = specialists[0]
  const wash = packages[0]
  return (
    <>
      <section className="hero" aria-label="Splash Car Wash & Detailing">
        <img className="hero-bg" src={business.heroPhoto} alt="Red classic Porsche 911 in the Splash studio with Gtechniq signage" fetchpriority="high" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow glass-chip">
              <img className="hero-logo" src={business.logo} alt="" aria-hidden="true" />✦ {business.sinceText}
            </p>
            <h1>
              {business.heroLine.split('!')[0]}! <span className="accent">Because we Care.</span>
            </h1>
            <p className="hero-sub">{business.heroSub}</p>
            <p className="hero-facts" aria-label="Quick facts">
              <span>Hand wash from ${wash.from} · Medium car ${wash.prices.medium}</span>
              <span>No booking — just drive in</span>
              <span>{business.addressShort}</span>
              <span>Open Sundays 9am–4pm</span>
            </p>
            <div className="hero-ctas">
              <CallButton label={`Call ${business.phoneDisplay}`} />
              <a className="btn btn-glass" href="#/services">
                See Services &amp; Prices →
              </a>
            </div>
            <p className="hero-meta">
              <span>
                ★ <strong>{business.rating}</strong> · {business.reviewCount} {business.reviewSource}
              </span>
              <span>{business.hoursShort}</span>
              <span>No booking needed for a wash — just drive in</span>
            </p>
          </div>
        </div>
        <p className="hero-scroll" aria-hidden="true">
          Scroll ↓
        </p>
      </section>

      <div className="price-strip" aria-label="Starting prices">
        <div className="wrap">
          <div className="price-tiles">
            {packages.slice(0, 3).map((p) => (
              <a className="price-tile" key={p.id} href="#/services">
                <span className="price-tile-label">{p.name}</span>
                <span className="price-tile-price">
                  From ${p.from} <small>· {p.sub || p.booking}</small>
                </span>
                <span className="price-tile-note">{p.booking}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="chips">
        <div className="wrap">
          <Reveal>
            <div className="chips-row glass">
              {trustChips.map((c) => (
                <span className="chip" key={c}>
                  <span className="dot" aria-hidden="true" />
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <section className="section" aria-label="Why Splash">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">Why Splash</span>
              <h2>We Care For Your Car</h2>
              <p>
                {business.yearsText} — hand wash only, 100% spring water, and a proper detail every time.
              </p>
            </div>
          </Reveal>
          <div className="pillars">
            {pillars.map((p) => (
              <Reveal key={p.n}>
                <article className="pillar">
                  <span className="n">{p.n}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-label="How it works">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">How it works</span>
              <h2>Easy as 1, 2, 3</h2>
            </div>
          </Reveal>
          <div className="steps">
            {howItWorks.map((s) => (
              <Reveal key={s.n}>
                <article className="step">
                  <span className="n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="All packages">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">Services &amp; prices</span>
              <h2>Start with a wash. Stay for the detail.</h2>
              <p>
                Every package, every price. Washes need no booking — just drive in. Tap any service to see
                exactly what&rsquo;s included.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <SizePicker size={size} onChange={onSizeChange} />
          </Reveal>
          <div className="cards three">
            {packages.map((p) => (
              <ServiceCard key={p.id} item={p} kind="package" onOpen={onOpen} size={size} />
            ))}
          </div>
          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <a className="btn btn-navy" href="#/services">
                Specialist treatments, promos &amp; add-ons →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-navy section" aria-label="Paint protection">
        <div className="wrap">
          <div className="split">
            <Reveal>
              <div className="split-photo">
                <img src={crystal.photo} alt={crystal.photoAlt} loading="lazy" />
              </div>
            </Reveal>
            <Reveal>
              <div>
                <span className="kicker">New car treatment</span>
                <h2>Gtechniq Crystal Serum paint protection</h2>
                <p>{crystal.blurb}</p>
                <ul className="check-list">
                  {crystal.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <p style={{ marginTop: 14 }}>
                  <strong>{crystal.priceText}</strong> · {crystal.booking}
                </p>
                <button type="button" className="btn btn-call" onClick={() => onOpen(crystal, 'specialist')}>
                  See what&rsquo;s included
                </button>{' '}
                <a className="btn btn-glass" href="#/protection">
                  Paint protection →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Products we use">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">Products &amp; process</span>
              <h2>Named products. No mystery chemicals.</h2>
              <p>Commercial-grade products, used the way the makers intended.</p>
            </div>
          </Reveal>
          <div className="products">
            {products.map((pr) => (
              <Reveal key={pr.name}>
                <article className="product">
                  <h3>{pr.name}</h3>
                  <p>{pr.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="section" style={{ paddingTop: 0 }} aria-label="Visit us">
        <div className="wrap">
          <Reveal>
            <div className="split">
              <div>
                <span className="kicker">Find us</span>
                <h2 style={{ color: 'var(--ink)' }}>On Glen Osmond Road, Glen Osmond</h2>
                <p style={{ color: 'var(--muted)' }}>{business.address}</p>
                <p style={{ color: 'var(--muted)' }}>
                  {business.hoursWeekday}
                  <br />
                  {business.hoursSunday}
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
                  <a className="btn btn-navy" href="#/visit">
                    Visit us →
                  </a>
                  <a className="btn btn-outline" href={business.mapsUrl} target="_blank" rel="noreferrer">
                    Get directions
                  </a>
                </div>
              </div>
              <div className="split-photo">
                <button
                  type="button"
                  onClick={() => onLightbox(0, 'shop')}
                  aria-label="View the Splash shopfront photo"
                  style={{ padding: 0, display: 'block', width: '100%' }}
                >
                  <img src={shopPhotos[0].src} alt={shopPhotos[0].alt} loading="lazy" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/* ---------- services ---------- */
const FILTERS = [
  { id: 'all', label: 'All services' },
  { id: 'walkin', label: 'No booking — drive in' },
  { id: 'book', label: 'Book a time' },
  { id: 'under100', label: 'Under $100' },
]

function ServicesView({ onOpen, size, onSizeChange }) {
  const [filter, setFilter] = useState('all')
  const match = (item) => {
    if (filter === 'all') return true
    if (filter === 'walkin') return item.booking === 'No booking required'
    if (filter === 'book') return item.booking !== 'No booking required'
    if (filter === 'under100') return item.from != null && item.from < 100
    return true
  }
  const shownPackages = packages.filter(match)
  const shownSpecialists = specialists.filter(match)
  return (
    <>
      <div className="wrap page-head">
        <Reveal>
          <span className="kicker">Services &amp; prices</span>
          <h1>Every wash, every detail. One price does it ALL.</h1>
          <p>
            No hidden surcharges for under-body spray, wheel cleaning or bug removal. Pick your car size,
            filter by what you need, compare the packages side by side, tap any service to see exactly
            what&rsquo;s included — then call to come in or to book.
          </p>
        </Reveal>
      </div>

      <div className="wrap">
        <Reveal>
          <SizePicker size={size} onChange={onSizeChange} />
          <div className="picker" role="group" aria-label="Filter services" style={{ marginTop: 10 }}>
            <span className="picker-label">Show me…</span>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`pill${filter === f.id ? ' active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <section className="section" style={{ paddingTop: 24 }} aria-label="Core packages">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">Core packages</span>
              <h2>Main packages</h2>
            </div>
          </Reveal>
          {shownPackages.length ? (
            <div className="cards three">
              {shownPackages.map((p) => (
                <ServiceCard key={p.id} item={p} kind="package" onOpen={onOpen} size={size} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--muted)' }}>No main packages match that filter — try “All services”.</p>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="Compare packages">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">At a glance</span>
              <h2>Compare the packages</h2>
              <p>Every package, side by side — so you can see which one fits your car.</p>
            </div>
          </Reveal>
          <Reveal>
            <CompareTable />
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="Specialist treatments">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">Booking required</span>
              <h2>Specialist treatments</h2>
              <p>Call to book a time — these are done by appointment.</p>
            </div>
          </Reveal>
          {shownSpecialists.length ? (
            <div className="cards three">
              {shownSpecialists.map((s) => (
                <ServiceCard key={s.id} item={s} kind="specialist" onOpen={onOpen} size={size} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--muted)' }}>No specialist treatments match that filter — try “All services”.</p>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="Promotions">
        <div className="wrap">
          <div className="promos">
            {promos.map((pr) => (
              <Reveal key={pr.title}>
                <article className="promo">
                  <h3>{pr.title}</h3>
                  <p>{pr.note}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="A La Carte menu">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">A La Carte</span>
              <h2>Add-ons &amp; extras</h2>
              <p>The full 19-item A La Carte menu from the Major Detail page.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="addons">
              {addOns.map((a) => (
                <div className="addon-row" key={a.name}>
                  <span>{a.name}</span>
                  <span className="price">{a.price}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <CallButton label="Call to add these to your wash" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/* ---------- protection ---------- */
function ProtectionView({ onOpen }) {
  const crystal = specialists[0]
  const others = specialists.slice(1)
  return (
    <>
      <div className="wrap page-head">
        <Reveal>
          <span className="kicker">Paint protection</span>
          <h1>New-car treatment, without the dealership price.</h1>
          <p>{crystal.blurb}</p>
        </Reveal>
      </div>

      <section className="section-navy section" aria-label="Crystal Serum">
        <div className="wrap">
          <div className="split">
            <Reveal>
              <div className="split-photo">
                <img src={crystal.photo} alt={crystal.photoAlt} />
              </div>
            </Reveal>
            <Reveal>
              <div>
                <span className="kicker">Gtechniq Crystal Serum</span>
                <h2>Ceramic paint protection</h2>
                <p>{crystal.blurb}</p>
                <ul className="check-list">
                  {crystal.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <p style={{ marginTop: 14 }}>
                  <strong>{crystal.priceText}</strong> · {crystal.booking}
                </p>
                <button type="button" className="btn btn-call" onClick={() => onOpen(crystal, 'specialist')}>
                  See what&rsquo;s included
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Protection products">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">The protection range</span>
              <h2>Protection that lasts</h2>
              <p>From a 4-month C2 sealant to full ceramic coating.</p>
            </div>
          </Reveal>
          <div className="products">
            {products.slice(0, 3).map((pr) => (
              <Reveal key={pr.name}>
                <article className="product">
                  <h3>{pr.name}</h3>
                  <p>{pr.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="More specialist treatments">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">Also available</span>
              <h2>More specialist treatments</h2>
            </div>
          </Reveal>
          <div className="cards three">
            {others.map((s) => (
              <ServiceCard key={s.id} item={s} kind="specialist" onOpen={onOpen} />
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
    </>
  )
}

/* ---------- gallery ---------- */
function GalleryView({ onLightbox }) {
  return (
    <>
      <div className="wrap page-head">
        <Reveal>
          <span className="kicker">Gallery</span>
          <h1>Our work, our shop.</h1>
          <p>Completed washes, detailing work and the Glen Osmond shop — tap any photo to see it bigger.</p>
        </Reveal>
      </div>

      <section className="section" style={{ paddingTop: 24 }} aria-label="Photo gallery">
        <div className="wrap">
          <div className="gallery-grid">
            {gallery.map((g, i) => (
              <Reveal key={g.src}>
                <button type="button" className="g-item" onClick={() => onLightbox(i, 'gallery')} aria-label={`View photo: ${g.caption}`}>
                  <img src={g.src} alt={g.alt} loading="lazy" />
                  <figcaption>{g.caption}</figcaption>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="The shop">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">The location</span>
              <h2>The shop on Glen Osmond Road</h2>
            </div>
          </Reveal>
          <div className="shop-strip">
            {shopPhotos.map((s) => (
              <Reveal key={s.src}>
                <figure>
                  <img src={s.src} alt={s.alt} loading="lazy" />
                  <figcaption>{s.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ---------- visit ---------- */
function VisitView({ onLightbox }) {
  return (
    <>
      <div className="wrap page-head">
        <Reveal>
          <span className="kicker">Visit us</span>
          <h1>Come and see us in Glen Osmond.</h1>
          <p>Washes need no booking — just drive in. For details and treatments, call ahead to book a time.</p>
        </Reveal>
      </div>

      <section className="section" style={{ paddingTop: 24 }} aria-label="Visit details">
        <div className="wrap">
          <div className="visit-grid">
            <Reveal>
              <div className="info-card">
                <h3>Address</h3>
                <p>{business.address}</p>
                <p style={{ marginTop: 10 }}>
                  <a href={business.mapsUrl} target="_blank" rel="noreferrer">
                    Get directions on Google Maps →
                  </a>
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="info-card">
                <h3>Hours</h3>
                <ul>
                  <li>{business.hoursWeekday}</li>
                  <li>{business.hoursSunday}</li>
                </ul>
              </div>
            </Reveal>
            <Reveal>
              <div className="info-card">
                <h3>Call or email</h3>
                <ul>
                  <li>
                    Phone: <a href={business.phoneHref}>{business.phoneDisplay}</a>
                  </li>
                  <li>
                    Email: <a href={`mailto:${business.email}`}>{business.email}</a>
                  </li>
                </ul>
                <div style={{ marginTop: 16 }}>
                  <CallButton label={`Call ${business.phoneDisplay}`} />
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="info-card">
                <h3>While you wait</h3>
                <p>Relax, coffee in hand, as our staff pamper your vehicle. Washed in 100% spring water and hand dried with 4 clean salon-quality microterry towels per car.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="The shop">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="kicker">Find the shop</span>
              <h2>What you&rsquo;ll see from the road</h2>
            </div>
          </Reveal>
          <div className="shop-strip">
            {shopPhotos.map((s, i) => (
              <Reveal key={s.src}>
                <figure>
                  <button
                    type="button"
                    onClick={() => onLightbox(i, 'shop')}
                    aria-label={`View photo: ${s.caption}`}
                    style={{ padding: 0, display: 'block', width: '100%' }}
                  >
                    <img src={s.src} alt={s.alt} loading="lazy" />
                  </button>
                  <figcaption>{s.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 26 }}>
              <a className="btn btn-navy" href={business.mapsUrl} target="_blank" rel="noreferrer">
                Open in Google Maps →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-label="Gift card">
        <div className="wrap">
          <Reveal>
            <div className="gift-card">
              <h3>{giftCard.title}</h3>
              <p>{giftCard.text}</p>
              <p style={{ fontSize: 14 }}>{giftCard.note}</p>
              <CallButton label={`Call ${business.phoneDisplay}`} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/* ---------- faq ---------- */
function FaqView() {
  return (
    <>
      <div className="wrap page-head">
        <Reveal>
          <span className="kicker">Questions, answered</span>
          <h1>Frequently asked questions</h1>
          <p>Anything else? Call {business.phoneDisplay} — we&rsquo;re happy to help.</p>
        </Reveal>
      </div>
      <section className="section" style={{ paddingTop: 24 }} aria-label="Frequently asked questions">
        <div className="wrap">
          <div className="faq-list">
            {faqs.map((f) => (
              <Reveal key={f.q}>
                <details className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <CallButton label="Still unsure? Call us" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/* ---------- app root ---------- */
export default function App() {
  const [route, setRoute] = useState(() => routeFromHash())
  const [modal, setModal] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [size, setSize] = useState('small')

  useEffect(() => {
    const onHash = () => {
      setRoute(routeFromHash())
      setModal(null)
      setLightbox(null)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.body.style.overflow = modal || lightbox ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [modal, lightbox])

  const openService = (item, kind) => setModal({ item, kind })
  const openLightbox = (index, list) => setLightbox({ index, list })

  const lightboxItems = lightbox ? (lightbox.list === 'shop' ? shopPhotos : gallery) : []
  const navLightbox = (dir) => {
    setLightbox((lb) => {
      if (!lb) return lb
      const items = lb.list === 'shop' ? shopPhotos : gallery
      const next = (lb.index + dir + items.length) % items.length
      return { ...lb, index: next }
    })
  }

  return (
    <>
      <Nav route={route} />
      <main key={route} className="view">
        {route === 'home' && <HomeView onOpen={openService} onLightbox={openLightbox} size={size} onSizeChange={setSize} />}
        {route === 'services' && <ServicesView onOpen={openService} size={size} onSizeChange={setSize} />}
        {route === 'protection' && <ProtectionView onOpen={openService} />}
        {route === 'gallery' && <GalleryView onLightbox={openLightbox} />}
        {route === 'visit' && <VisitView onLightbox={openLightbox} />}
        {route === 'faq' && <FaqView />}
      </main>
      <Footer />
      {modal ? <ServiceModal item={modal.item} kind={modal.kind} onClose={() => setModal(null)} /> : null}
      {lightbox ? (
        <Lightbox
          items={lightboxItems}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={navLightbox}
        />
      ) : null}
    </>
  )
}
