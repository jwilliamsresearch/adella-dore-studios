# Made by XARI — footer credit

A self-contained credit block for sites built by XARI. No build step, no
JavaScript, no external requests. One anchor, one `<style>`, done.

## Files

| File | Use |
| --- | --- |
| `xari-credit.html` | **The copy-pastable block.** Styles + markup in one. Paste and ship. |
| `xari-credit.markup.html` | Markup only — for when the CSS lives in your stylesheet. |
| `xari-credit.css` | Styles only — pair with the markup above. |
| `preview.html` | Open in a browser to see it on four different grounds. |

## Use it

Paste `xari-credit.html` into the footer. That is the whole install.

If the site already has a stylesheet, prefer the split version: drop
`xari-credit.css` in with your other CSS and paste `xari-credit.markup.html`
into the footer.

## Theming

Set `data-xari-theme` on the anchor:

- `"light"` — dark text, for pale backgrounds
- `"dark"` — pale text, for dark backgrounds
- `"auto"` *(default)* — follows the visitor's `prefers-color-scheme`

For anything else, override the custom properties. Every colour in the component
resolves from these, so nothing else needs touching:

```css
.xari-credit {
  --xari-fg: #5e1d26;         /* wordmark + hover text */
  --xari-muted: #7d6c60;      /* resting text */
  --xari-line: rgba(0,0,0,.16);
  --xari-chip-hover: #5e1d26; /* mark fill on hover */
  --xari-chip-ink: #fff;      /* mark glyph on hover */
}
```

## What it does

- The X mark rotates and **redraws itself** stroke by stroke on hover
- A light sweeps across the wordmark
- The rule extends and the arrow arrives

All of it is CSS. All of it is disabled under `prefers-reduced-motion: reduce`.

## Accessibility

- One `<a>` with a descriptive `aria-label`; decoration is `aria-hidden`
- Keyboard focus triggers the same states as hover, plus a visible focus ring
- The tagline is decorative and hides below 560px so the credit stays on one line

---

XARI — Data · Insight · Strategy · [xari.co](https://xari.co)
