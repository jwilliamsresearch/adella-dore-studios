# Adella Dore Studios

A one-page site for [@adelladorestudios](https://www.instagram.com/adelladorestudios/) —
a wedding and event design studio in Manchester, UK.

Vite + vanilla HTML/CSS/JS. No framework, no runtime dependencies. The page is
**pre-rendered at build time**, so `dist/index.html` ships as complete static
HTML: crawlers, link previews and no-JS visitors get the whole page.

## Commands

```bash
npm install
npm run dev      # dev server at :5173
npm run build    # images → XARI credit → dist/
npm run preview  # serve dist/ at :4173
```

`npm run build` runs three steps:

1. `npm run images` — regenerates AVIF/WebP derivatives, LQIP placeholders, the
   social card and the app icons from `public/media/*.jpg`
2. `npm run xari` — regenerates the standalone credit in `xari-credit/`
3. `vite build` — pre-renders and bundles into `dist/`

`dist/` is a plain static folder. Drop it on Netlify, Vercel, Cloudflare Pages,
GitHub Pages, or any bucket.

## Layout

```
src/
  data.js             all copy, services, work, FAQs — edit content here
  render.js           build-time HTML + JSON-LD renderer (runs in Node)
  styles.css          the design system
  main.js             progressive enhancement only
  xari-credit.{js,css}  the "Made by XARI" component (single source)
  media-manifest.json generated — do not edit
scripts/
  optimize-images.mjs
  build-xari-credit.mjs
public/media/         original photography + generated derivatives
xari-credit/          generated — the standalone, copy-pastable credit
```

## Content

Everything in `src/data.js` comes from the studio's own public posts on TikTok,
Threads and Instagram. Nothing is invented — no fabricated testimonials, no
made-up statistics. The two numbers on the page (880K+ likes, 2.4K followers)
are from the public TikTok profile and will drift; update them in `site.proof`.

**Photography** is pulled from the studio's own TikTok post covers. Replace
`public/media/work-*.jpg` with full-resolution originals when they are
available and re-run `npm run images` — nothing else needs to change.

### Changing the cover

`site.cover` in `src/data.js` drives the hero photograph, the crop framing, the
`og:image` and the preload hint together:

```js
cover: { img: 'work-04', position: '52% 46%', alt: '…' }
```

Point `img` at any key in `media-manifest.json` and re-run `npm run build`.

## Before it goes live

- [ ] Point `site.url` in `src/data.js` at the real domain, then update
      `public/robots.txt` and `public/sitemap.xml` to match
- [ ] Add a real enquiry route. Right now every call to action opens a social
      DM, which is honest but lossy — a form or a `mailto:` will convert better
- [ ] Confirm the two social proof numbers are still roughly right
- [ ] Swap in high-resolution originals for the gallery where they exist
      (several current stills carry burnt-in TikTok captions)

## SEO

- Pre-rendered static HTML with a single `<h1>` and a real heading hierarchy
- `LocalBusiness` / `ProfessionalService`, `WebSite`, `WebPage`, `FAQPage` and
  `ImageGallery` JSON-LD, with an `OfferCatalog` of the four services
- Canonical URL, Open Graph and Twitter cards, `en-GB` locale, geo meta
- `robots.txt`, image-annotated `sitemap.xml`, web manifest, SVG + PNG icons
- AVIF/WebP with responsive `srcset`, explicit `width`/`height` on every image,
  LQIP backgrounds and a preloaded hero — no layout shift

## Accessibility

Skip link, visible focus rings, `aria-current` on the active nav item, labelled
controls, descriptive alt text on every photograph, and a full
`prefers-reduced-motion` path that disables the parallax, reveals and marquee.

## Credit

Footer credit by [XARI](https://xari.co). The standalone version lives in
[`xari-credit/`](./xari-credit/) — see its README.
