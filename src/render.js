/**
 * Build-time renderer. Runs in Node inside the Vite plugin and produces the
 * full markup + structured data, so the shipped index.html is complete static
 * HTML — crawlers and no-JS visitors get the whole page, not an empty shell.
 */

import { readFileSync } from 'node:fs';

// The Vite plugin re-imports this module with a cache-busting query on every
// dev request. Its own imports would otherwise stay pinned to the first load,
// so pull them dynamically with the same bust — edits to data show up at once.
const bust = `?t=${Date.now()}`;
const from = (file) => new URL(file, import.meta.url).href + bust;

const { site, services, process: steps, work, faqs } = await import(from('./data.js'));
const { xariCredit } = await import(from('./xari-credit.js'));

const manifest = JSON.parse(readFileSync(new URL('./media-manifest.json', import.meta.url), 'utf8'));

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Builds an <img> with AVIF/WebP sources, LQIP background and correct dimensions. */
function picture(name, { alt, sizes, priority = false, className = '' } = {}) {
  const m = manifest[name];
  if (!m) throw new Error(`Unknown image: ${name}`);
  const srcset = (ext) => m.widths.map((w) => `/media/opt/${name}-${w}.${ext} ${w}w`).join(', ');
  const fallbackW = m.widths[m.widths.length - 1];
  const h = Math.round(fallbackW / m.aspect);

  return `<div class="media ${className}" style="--lqip:url('${m.lqip}')">
        <picture>
          <source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}">
          <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}">
          <img src="/media/opt/${name}-${fallbackW}.webp" width="${fallbackW}" height="${h}"
               alt="${esc(alt)}" sizes="${sizes}"
               ${priority ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'}>
        </picture>
      </div>`;
}

const ARROW = '<svg class="arrow" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M1 12L12 1M12 1H4M12 1V9" stroke="currentColor" stroke-width="1.2"/></svg>';

const ICONS = {
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.9 5.9 0 0 0 1.38 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"/></svg>',
  tiktok:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.69a5.68 5.68 0 0 0-.77-.05A5.66 5.66 0 1 0 15.54 15V8.72a7.35 7.35 0 0 0 4.3 1.38V7.01a4.29 4.29 0 0 1-3.24-1.19Z"/></svg>',
  threads:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.1 11.13c-.11-.05-.22-.1-.34-.15-.2-3.66-2.2-5.75-5.56-5.77h-.05c-2.01 0-3.68.86-4.71 2.42l1.85 1.27c.77-1.16 1.97-1.41 2.86-1.41h.03c1.11.01 1.95.33 2.49.96.4.46.66 1.09.8 1.89a14.4 14.4 0 0 0-3.2-.16c-3.22.19-5.29 2.07-5.15 4.68.07 1.33.73 2.47 1.87 3.21.96.63 2.2.94 3.48.87 1.7-.09 3.03-.74 3.96-1.92.7-.9 1.15-2.06 1.35-3.53.81.49 1.41 1.14 1.74 1.92.56 1.32.6 3.5-1.17 5.27-1.55 1.55-3.42 2.22-6.24 2.24-3.13-.02-5.5-1.03-7.04-2.99C4.5 18.1 3.76 15.5 3.73 12c.03-3.5.77-6.1 2.2-7.93C7.47 2.11 9.84 1.1 12.97 1.08c3.16.02 5.57 1.04 7.17 3.01.78.97 1.37 2.19 1.76 3.61l2.17-.58c-.47-1.75-1.21-3.26-2.22-4.5C19.79 1.1 16.79-.19 12.98-.2h-.02C9.16-.19 6.19 1.1 4.14 3.65 2.32 5.92 1.38 9.07 1.35 11.99v.02c.03 2.92.97 6.07 2.79 8.34 2.05 2.55 5.02 3.84 8.82 3.85h.02c3.38-.02 5.76-.91 7.72-2.87 2.57-2.56 2.49-5.77 1.64-7.74-.61-1.41-1.77-2.56-3.35-3.32Zm-5.78 5.66c-1.42.08-2.89-.56-2.96-1.9-.05-.99.7-2.09 3.04-2.23.27-.02.53-.02.79-.02.85 0 1.64.08 2.36.24-.27 3.35-1.84 3.85-3.23 3.91Z"/></svg>',
};

/* ------------------------------------------------------------------ blocks */

function header() {
  const links = [
    ['#work', 'Work'],
    ['#services', 'Services'],
    ['#process', 'Process'],
    ['#about', 'Studio'],
    ['#faq', 'FAQ'],
  ];
  const nav = links.map(([h, t]) => `<a href="${h}">${t}</a>`).join('');
  const drawerLinks = links
    .map(([h, t], i) => `<a href="${h}" style="--i:${i}" data-drawer-link>${t}</a>`)
    .join('');

  return `<header class="header" id="header">
    <div class="shell header__inner">
      <a class="brand" href="#top" aria-label="${esc(site.name)} — home">
        <span class="brand__mark">Adella Dore</span>
        <span class="brand__sub">Studios</span>
      </a>
      <nav class="nav nav--desktop" aria-label="Primary">${nav}</nav>
      <a class="btn header__cta" href="#contact">Enquire ${ARROW}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <nav class="drawer" id="drawer" aria-label="Mobile">
    ${drawerLinks}
    <a href="#contact" style="--i:5" data-drawer-link>Enquire</a>
    <div class="drawer__foot">
      <a href="${site.socials.instagram}" target="_blank" rel="noopener">Instagram</a>
      <a href="${site.socials.tiktok}" target="_blank" rel="noopener">TikTok</a>
      <a href="${site.socials.threads}" target="_blank" rel="noopener">Threads</a>
    </div>
  </nav>`;
}

function hero() {
  const { img, alt, position } = site.cover;
  return `<section class="hero" id="top" style="--cover-pos:${position}">
    <div class="hero__bg">
      ${picture(img, { alt, sizes: '100vw', priority: true })}
    </div>
    <div class="shell hero__inner">
      <p class="eyebrow hero__fade" style="--i:0">${esc(site.city)} &middot; Wedding &amp; Event Design</p>
      <h1 class="display hero__title">
        <span class="reveal-line"><span style="--i:0">Crafting</span></span>
        <span class="reveal-line"><span style="--i:1">moments,</span></span>
        <span class="reveal-line"><span style="--i:2" class="italic">creating</span></span>
        <span class="reveal-line"><span style="--i:3" class="italic">memories</span></span>
      </h1>
      <div class="hero__row">
        <p class="hero__blurb hero__fade" style="--i:1">
          A Manchester design studio shaping weddings and celebrations from the first
          mood board to the last candle — concept, florals, tablescapes and the day itself.
        </p>
        <div class="hero__actions hero__fade" style="--i:2">
          <a class="btn" href="#contact">Start an enquiry ${ARROW}</a>
          <a class="btn btn--ghost" href="#work">View the work</a>
        </div>
      </div>
    </div>
    <span class="scroll-cue" aria-hidden="true">Scroll</span>
  </section>`;
}

function marquee() {
  const words = [
    'Weddings',
    'Tablescapes',
    'Floral design',
    'Baby showers',
    'Balloon installations',
    'Private views',
    'Birthdays',
    'Draping &amp; backdrops',
    'Coordination',
  ];
  const group = `<div class="marquee__group" aria-hidden="true">${words.map((w) => `<span>${w}</span>`).join('')}</div>`;
  return `<div class="marquee">
    <div class="marquee__track">${group}${group}</div>
    <p class="sr-only">Services: ${words.join(', ').replace(/&amp;/g, 'and')}.</p>
  </div>`;
}

function intro() {
  const stats = site.proof
    .map(
      (s, i) => `<div class="stat" data-reveal style="--d:${i * 0.08}s">
        <div class="stat__value">${esc(s.value)}</div>
        <div class="stat__label">${esc(s.label)}</div>
      </div>`
    )
    .join('');

  return `<section class="section-pad" id="about">
    <div class="shell intro__grid">
      <div data-reveal>
        <p class="eyebrow">The studio</p>
        <h2 class="h2" style="margin-top:1.5rem">A room that feels<br><span class="italic">inevitable.</span></h2>
      </div>
      <div class="intro__body" data-reveal style="--d:0.1s">
        <p class="lede">
          Adella Dore Studios is a wedding and event design studio based in Manchester,
          working across the North West and beyond.
        </p>
        <p>
          The work starts with a conversation and ends with a room. In between sits the
          part most people never see — the colour story, the sourcing, the sightlines, the
          hundred small decisions that make a space feel considered rather than decorated.
        </p>
        <p>
          We design weddings in full, and we style celebrations of every size: baby showers,
          milestone birthdays, dinner parties, private views. Whatever the brief, the standard
          does not change. Nothing goes in the room that has not earned its place.
        </p>
        <div class="stats">${stats}</div>
      </div>
    </div>
  </section>`;
}

function servicesBlock() {
  const rows = services
    .map(
      (s, i) => `<article class="svc" id="${s.id}" data-reveal style="--d:${i * 0.05}s">
      <div class="svc__n">0${i + 1}</div>
      <div>
        <h3 class="h3 svc__title">${esc(s.title)}</h3>
        <p class="svc__lede">${esc(s.lede)}</p>
      </div>
      <div>
        <p class="svc__body">${esc(s.body)}</p>
        <ul class="svc__list">${s.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
    </article>`
    )
    .join('');

  return `<section class="section-pad" id="services">
    <div class="shell">
      <div class="services__head" data-reveal>
        <p class="eyebrow">What we do</p>
        <h2 class="h2">Design, and everything <span class="italic">holding it up.</span></h2>
        <p class="lede muted">
          Four ways to work with the studio. Most couples start with the first and let it grow.
        </p>
      </div>
      ${rows}
    </div>
  </section>`;
}

function workBlock() {
  const items = work.filter((w) => !w.feature);
  const cards = work
    .map((w, i) => {
      const cls = w.feature ? 'card card--feature' : i === 4 || i === 5 ? 'card card--wide' : 'card';
      const sizes = w.feature ? '(min-width:800px) 55vw, 100vw' : '(min-width:800px) 30vw, 50vw';
      return `<a class="${cls}" href="${w.href}" target="_blank" rel="noopener"
        data-reveal style="--d:${(i % 3) * 0.07}s" aria-label="${esc(w.title)} — watch on TikTok">
        ${picture(w.img, { alt: w.alt, sizes })}
        <span class="card__veil"></span>
        <span class="card__play" aria-hidden="true">
          <svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor"><path d="M11 6 0 12V0z"/></svg>
        </span>
        <span class="card__cap">
          <span class="card__meta">${esc(w.meta)}</span>
          <span class="card__title">${esc(w.title)}</span>
        </span>
      </a>`;
    })
    .join('');

  return `<section class="work section-pad" id="work">
    <div class="shell">
      <div class="work__head" data-reveal>
        <div>
          <p class="eyebrow">Selected work</p>
          <h2 class="h2" style="margin-top:1.5rem">Rooms we have <span class="italic">built.</span></h2>
        </div>
        <a class="tlink" href="${site.socials.tiktok}" target="_blank" rel="noopener">See it all on TikTok</a>
      </div>
      <div class="gallery">${cards}</div>
      <p class="sr-only">${items.length + 1} projects, each linking to the full film on TikTok.</p>
    </div>
  </section>`;
}

function processBlock() {
  const items = steps
    .map(
      (s, i) => `<article class="step" data-reveal style="--d:${i * 0.08}s">
      <div class="step__n">${s.n}</div>
      <h3 class="step__title">${esc(s.title)}</h3>
      <p class="step__body">${esc(s.body)}</p>
    </article>`
    )
    .join('');

  return `<section class="process section-pad" id="process">
    <div class="shell">
      <div class="process__head" data-reveal>
        <p class="eyebrow">How it works</p>
        <h2 class="h2">From inception<br><span class="italic">to execution.</span></h2>
        <p class="lede">
          Four stages, no surprises. You always know what is happening, what it costs,
          and what comes next.
        </p>
      </div>
      <div class="steps">${items}</div>
    </div>
  </section>`;
}

function quoteBlock() {
  return `<section class="section-pad quote">
    <div class="shell quote__inner" data-reveal>
      <span class="quote__mark" aria-hidden="true">&ldquo;</span>
      <blockquote>
        It was refreshing bringing this concept to life from inception to execution.
      </blockquote>
      <figcaption>Adella Dore Studios &middot; Adanna &amp; Ryan, Manchester</figcaption>
    </div>
  </section>`;
}

function socialBlock() {
  const reel = work
    .slice(1, 7)
    .map(
      (w) => `<a href="${w.href}" target="_blank" rel="noopener" aria-label="${esc(w.title)} on TikTok">
        ${picture(w.img, { alt: w.alt, sizes: '(min-width:900px) 16vw, 30vw' })}
      </a>`
    )
    .join('');

  return `<section class="social section-pad">
    <div class="shell social__grid">
      <div class="social__head" data-reveal>
        <p class="eyebrow">Follow along</p>
        <h2 class="h2">${esc(site.handle)}</h2>
        <p class="muted" style="max-width:38ch">
          Behind the scenes from every setup — the build, the details and the moment
          the doors open. Come and see the work in motion.
        </p>
        <div class="social__links">
          <a class="chip" href="${site.socials.instagram}" target="_blank" rel="noopener">${ICONS.instagram} Instagram</a>
          <a class="chip" href="${site.socials.tiktok}" target="_blank" rel="noopener">${ICONS.tiktok} TikTok</a>
          <a class="chip" href="${site.socials.threads}" target="_blank" rel="noopener">${ICONS.threads} Threads</a>
        </div>
      </div>
      <div class="reel" data-reveal style="--d:0.1s">${reel}</div>
    </div>
  </section>`;
}

function faqBlock() {
  const items = faqs
    .map(
      (f) => `<details${faqs.indexOf(f) === 0 ? ' open' : ''}>
      <summary>${esc(f.q)}<span class="plus" aria-hidden="true"></span></summary>
      <div class="faq__a">${esc(f.a)}</div>
    </details>`
    )
    .join('');

  return `<section class="section-pad" id="faq">
    <div class="shell faq__grid">
      <div data-reveal>
        <p class="eyebrow">Questions</p>
        <h2 class="h2" style="margin-top:1.5rem">Good to <span class="italic">know.</span></h2>
      </div>
      <div class="faq__list" data-reveal style="--d:0.1s">${items}</div>
    </div>
  </section>`;
}

function contactBlock() {
  return `<section class="contact section-pad" id="contact">
    <div class="contact__bg">
      ${picture('work-07', { alt: '', sizes: '100vw' })}
    </div>
    <div class="shell contact__inner" data-reveal>
      <p class="eyebrow eyebrow--center">Enquiries</p>
      <h2 class="h2">Tell us about <span class="italic">the day.</span></h2>
      <p class="lede">
        Send the date, the venue and a rough guest count. We will come back to you with
        availability and what the studio would do with it.
      </p>
      <div class="contact__actions">
        <a class="btn" href="${site.socials.instagram}" target="_blank" rel="noopener">Message on Instagram ${ARROW}</a>
        <a class="btn btn--ghost" href="${site.socials.threads}" target="_blank" rel="noopener">Threads</a>
        <a class="btn btn--ghost" href="${site.socials.tiktok}" target="_blank" rel="noopener">TikTok</a>
      </div>
      <p class="muted" style="font-size:.8rem;letter-spacing:.08em;color:color-mix(in srgb,var(--paper) 60%,transparent)">
        Based in ${esc(site.city)} &middot; Available across the UK
      </p>
    </div>
  </section>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `<footer class="footer">
    <div class="shell">
      <div class="footer__top">
        <div>
          <div class="footer__brand">Adella Dore<br><span class="italic">Studios</span></div>
          <p class="footer__tag">${esc(site.tagline)} — wedding and event design in ${esc(site.city)}, ${esc(site.country)}.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="#work">Selected work</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#about">The studio</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Elsewhere</h4>
          <ul>
            <li><a href="${site.socials.instagram}" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="${site.socials.tiktok}" target="_blank" rel="noopener">TikTok</a></li>
            <li><a href="${site.socials.threads}" target="_blank" rel="noopener">Threads</a></li>
            <li><a href="#contact">Enquire</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>&copy; ${year} ${esc(site.name)}. All rights reserved.</span>
        <span>${esc(site.city)}, ${esc(site.country)}</span>
      </div>
      <div class="footer__credit">
        ${xariCredit({ theme: 'dark' })}
      </div>
    </div>
  </footer>`;
}

/* --------------------------------------------------------- structured data */

function jsonLd() {
  const graph = [
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': `${site.url}/#studio`,
      name: site.name,
      alternateName: 'Adella Dore',
      slogan: site.tagline,
      description: `${site.name} is a wedding and event design studio in ${site.city}, ${site.country}, designing and styling weddings, baby showers, birthdays and private events from concept to execution.`,
      url: site.url,
      image: `${site.url}/media/og-cover.jpg`,
      logo: `${site.url}/icon-512.png`,
      foundingDate: site.founded,
      priceRange: '££',
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.city,
        addressRegion: site.region,
        addressCountry: site.countryCode,
      },
      areaServed: [
        { '@type': 'City', name: 'Manchester' },
        { '@type': 'AdministrativeArea', name: 'Greater Manchester' },
        { '@type': 'Country', name: 'United Kingdom' },
      ],
      sameAs: Object.values(site.socials),
      knowsAbout: ['Wedding design', 'Event styling', 'Floral design', 'Tablescapes', 'Event coordination'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Design services',
        itemListElement: services.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.title, description: s.body, serviceType: s.title },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: 'en-GB',
      publisher: { '@id': `${site.url}/#studio` },
    },
    {
      '@type': 'WebPage',
      '@id': `${site.url}/#webpage`,
      url: site.url,
      name: `${site.name} — Wedding & Event Design, ${site.city}`,
      isPartOf: { '@id': `${site.url}/#website` },
      about: { '@id': `${site.url}/#studio` },
      primaryImageOfPage: `${site.url}/media/og-cover.jpg`,
    },
    {
      '@type': 'FAQPage',
      '@id': `${site.url}/#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'ImageGallery',
      '@id': `${site.url}/#gallery`,
      name: `${site.name} — selected work`,
      image: work.map((w) => ({
        '@type': 'ImageObject',
        contentUrl: `${site.url}/media/opt/${w.img}-1200.webp`,
        name: w.title,
        caption: w.alt,
      })),
    },
  ];

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* -------------------------------------------------------------------- head */

export function renderHead() {
  const title = `${site.name} — Wedding & Event Design in ${site.city}`;
  const desc = `Luxury wedding and event design studio in ${site.city}. Adella Dore Studios designs and styles weddings, baby showers, birthdays and private events from concept to execution. Crafting moments, creating memories.`;
  const og = `${site.url}/media/og-cover.jpg`;
  const coverW = manifest[site.cover.img].widths.at(-1);
  const preloadHref = `/media/opt/${site.cover.img}-${coverW}.avif`;

  return `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${site.url}/">
  <meta name="author" content="${esc(site.name)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#fbf7f1" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#3d1219" media="(prefers-color-scheme: dark)">
  <meta name="geo.region" content="GB-MAN">
  <meta name="geo.placename" content="${esc(site.city)}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:locale" content="en_GB">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${site.url}/">
  <meta property="og:image" content="${og}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(site.cover.alt)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${og}">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/icon-180.png">
  <link rel="manifest" href="/site.webmanifest">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="image" href="${preloadHref}" type="image/avif" fetchpriority="high">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">

  <script type="application/ld+json">${jsonLd()}</script>`;
}

export function renderBody() {
  return [
    '<a class="skip" href="#main">Skip to content</a>',
    header(),
    '<main id="main">',
    hero(),
    marquee(),
    intro(),
    servicesBlock(),
    workBlock(),
    processBlock(),
    quoteBlock(),
    socialBlock(),
    faqBlock(),
    contactBlock(),
    '</main>',
    footer(),
  ].join('\n');
}
