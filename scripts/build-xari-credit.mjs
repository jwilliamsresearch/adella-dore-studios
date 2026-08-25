/**
 * Emits the standalone, copy-pastable "Made by XARI" credit into /xari-credit,
 * generated from the same source the site itself uses so the two never drift.
 *
 *   npm run xari
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { xariCredit, XARI } from '../src/xari-credit.js';

const OUT = 'xari-credit';
await mkdir(OUT, { recursive: true });

const css = await readFile('src/xari-credit.css', 'utf8');

/* ------------------------------------------------- 1. the paste-able snippet */

const snippet = `<!-- ═════════════════════════════════════════════════════════════════════
     Made by ${XARI.name} — drop-in footer credit
     Paste this whole block anywhere in your page. No build step, no JS,
     no dependencies. Theme it with data-xari-theme="light|dark|auto".
     ═════════════════════════════════════════════════════════════════════ -->
<style>
${css.trim()}
</style>

${xariCredit({ theme: 'auto' })}
<!-- ══════════════════════════════════════════════════ end Made by ${XARI.name} ══ -->
`;

await writeFile(`${OUT}/xari-credit.html`, snippet);
await writeFile(`${OUT}/xari-credit.css`, css);
await writeFile(`${OUT}/xari-credit.markup.html`, xariCredit({ theme: 'auto' }) + '\n');

/* ---------------------------------------------------- 2. a live preview page */

const swatch = (label, theme, bg, note, dark = false) => `
      <section class="demo"${dark ? ' data-dark' : ''} style="background:${bg}">
        <header><span>${label}</span><span class="note">${note}</span></header>
        ${xariCredit({ theme })}
      </section>`;

const preview = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${XARI.name} credit — preview</title>
<style>
${css.trim()}

/* ---- preview chrome only, not part of the component ---- */
* { box-sizing: border-box; }
body {
  margin: 0; padding: clamp(1.5rem, 5vw, 4rem);
  background: #e9e7e3; color: #111;
  font: 400 15px/1.6 ui-sans-serif, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
}
h1 { font-weight: 400; letter-spacing: -0.02em; font-size: clamp(1.6rem, 4vw, 2.4rem); margin: 0 0 .4rem; }
.sub { color: #6f6a63; margin: 0 0 2.5rem; max-width: 60ch; }
.demo {
  display: grid; gap: 1.25rem; padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 14px; margin-bottom: 1rem; box-shadow: 0 1px 0 rgba(0,0,0,.06);
}
.demo header {
  display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; opacity: .55;
}
.demo[data-dark] header { color: #f7f6f4; }
.note { text-transform: none; letter-spacing: .02em; }
code { font: 500 .85em ui-monospace, SFMono-Regular, Menlo, monospace; background: rgba(0,0,0,.07); padding: .15em .45em; border-radius: 4px; }
</style>
</head>
<body>
  <h1>Made by ${XARI.name}</h1>
  <p class="sub">Hover or tab to any credit below. Copy <code>xari-credit.html</code> and paste it
  into a footer — it brings its own styles and adapts to the ground it sits on.</p>
${swatch('Light ground', 'light', '#f7f6f4', 'data-xari-theme="light"')}
${swatch('Dark ground', 'dark', '#111111', 'data-xari-theme="dark"', true)}
${swatch('Tinted dark', 'dark', '#241c18', 'inherits the dark tokens', true)}
${swatch('Follows the OS', 'auto', 'transparent', 'data-xari-theme="auto"')}
</body>
</html>
`;

await writeFile(`${OUT}/preview.html`, preview);

/* -------------------------------------------------------------- 3. the readme */

const readme = `# Made by ${XARI.name} — footer credit

A self-contained credit block for sites built by ${XARI.name}. No build step, no
JavaScript, no external requests. One anchor, one \`<style>\`, done.

## Files

| File | Use |
| --- | --- |
| \`xari-credit.html\` | **The copy-pastable block.** Styles + markup in one. Paste and ship. |
| \`xari-credit.markup.html\` | Markup only — for when the CSS lives in your stylesheet. |
| \`xari-credit.css\` | Styles only — pair with the markup above. |
| \`preview.html\` | Open in a browser to see it on four different grounds. |

## Use it

Paste \`xari-credit.html\` into the footer. That is the whole install.

If the site already has a stylesheet, prefer the split version: drop
\`xari-credit.css\` in with your other CSS and paste \`xari-credit.markup.html\`
into the footer.

## Theming

Set \`data-xari-theme\` on the anchor:

- \`"light"\` — dark text, for pale backgrounds
- \`"dark"\` — pale text, for dark backgrounds
- \`"auto"\` *(default)* — follows the visitor's \`prefers-color-scheme\`

For anything else, override the custom properties. Every colour in the component
resolves from these, so nothing else needs touching:

\`\`\`css
.xari-credit {
  --xari-fg: #5e1d26;         /* wordmark + hover text */
  --xari-muted: #7d6c60;      /* resting text */
  --xari-line: rgba(0,0,0,.16);
  --xari-chip-hover: #5e1d26; /* mark fill on hover */
  --xari-chip-ink: #fff;      /* mark glyph on hover */
}
\`\`\`

## What it does

- The X mark rotates and **redraws itself** stroke by stroke on hover
- A light sweeps across the wordmark
- The rule extends and the arrow arrives

All of it is CSS. All of it is disabled under \`prefers-reduced-motion: reduce\`.

## Accessibility

- One \`<a>\` with a descriptive \`aria-label\`; decoration is \`aria-hidden\`
- Keyboard focus triggers the same states as hover, plus a visible focus ring
- The tagline is decorative and hides below 560px so the credit stays on one line

---

${XARI.name} — ${XARI.tagline} · [${XARI.url.replace('https://', '')}](${XARI.url})
`;

await writeFile(`${OUT}/README.md`, readme);

console.log(`✓ ${OUT}/ — xari-credit.html, .css, .markup.html, preview.html, README.md`);
