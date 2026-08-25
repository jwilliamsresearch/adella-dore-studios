/**
 * Progressive enhancement only. Every word on the page is in the static HTML;
 * this file adds motion, the mobile drawer and image fade-in on top of it.
 */

import './styles.css';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------- images */
// Fade each photo in as it decodes so the LQIP never snaps.
function markLoaded(img) {
  if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
  else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
  img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
}
document.querySelectorAll('.media img').forEach(markLoaded);

/* --------------------------------------------------------- scroll reveals */
const revealables = document.querySelectorAll('[data-reveal]');
if (reduced || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );
  revealables.forEach((el) => io.observe(el));
}

/* ----------------------------------------------------------------- header */
const header = document.getElementById('header');
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-stuck', y > 40);
  // Hide on the way down, bring it back the moment you scroll up.
  const goingDown = y > lastY && y > 320;
  header.classList.toggle('is-hidden', goingDown && !drawer.classList.contains('is-open'));
  lastY = y;
  ticking = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  },
  { passive: true }
);

/* ----------------------------------------------------------------- drawer */
const drawer = document.getElementById('drawer');
const burger = document.querySelector('.burger');

function setDrawer(open) {
  drawer.classList.toggle('is-open', open);
  // Keeps the header legible: over the drawer it goes back to dark-on-paper.
  header.classList.toggle('is-menu', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) header.classList.remove('is-hidden');
}

burger.addEventListener('click', () => setDrawer(!drawer.classList.contains('is-open')));
drawer.querySelectorAll('[data-drawer-link]').forEach((a) => a.addEventListener('click', () => setDrawer(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
    setDrawer(false);
    burger.focus();
  }
});

/* ------------------------------------------------------- active nav state */
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = new Map(
  [...document.querySelectorAll('.nav--desktop a')].map((a) => [a.getAttribute('href').slice(1), a])
);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const link = navLinks.get(entry.target.id);
        if (!link) continue;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ------------------------------------------------------------ hero parallax */
// A gentle drift on the hero photograph — skipped entirely when motion is reduced.
const heroImg = document.querySelector('.hero__bg .media');
if (heroImg && !reduced) {
  let raf = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.02)`;
        raf = 0;
      });
    },
    { passive: true }
  );
}

onScroll();
