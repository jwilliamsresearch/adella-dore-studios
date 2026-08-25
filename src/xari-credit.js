/**
 * "Made by XARI" credit — single source of truth.
 *
 * Used two ways:
 *   1. Rendered into this site's footer (see render.js).
 *   2. Exported by scripts/build-xari-credit.mjs as a standalone,
 *      copy-pastable snippet in /xari-credit.
 */

export const XARI = {
  name: 'XARI',
  url: 'https://xari.co',
  tagline: 'Data · Insight · Strategy',
};

/**
 * @param {object}  [opts]
 * @param {'light'|'dark'|'auto'} [opts.theme='auto']  Ground the credit sits on.
 * @param {string}  [opts.prefix='Designed & built by']
 * @param {boolean} [opts.tagline=true]                Show the tagline on wider screens.
 */
export function xariCredit({ theme = 'auto', prefix = 'Designed &amp; built by', tagline = true } = {}) {
  const tag = tagline
    ? `
  <span class="xari-credit__sep" aria-hidden="true"></span>
  <span class="xari-credit__tag" aria-hidden="true">${XARI.tagline}</span>`
    : '';

  return `<a class="xari-credit" data-xari-theme="${theme}" href="${XARI.url}" target="_blank" rel="noopener"
   aria-label="${prefix.replace('&amp;', 'and')} ${XARI.name} — ${XARI.tagline}. Opens in a new tab.">
  <span class="xari-credit__mark" aria-hidden="true">
    <svg viewBox="0 0 16 16"><path d="M3 3 L13 13"/><path d="M13 3 L3 13"/></svg>
  </span>
  <span class="xari-credit__text">
    <span class="xari-credit__pre">${prefix}</span>
    <span class="xari-credit__word">${XARI.name}</span>
  </span>${tag}
  <svg class="xari-credit__arrow" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M1 9 L9 1 M9 1 H3 M9 1 V7"/>
  </svg>
</a>`;
}
