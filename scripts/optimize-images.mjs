/**
 * Generates responsive WebP/AVIF derivatives + inline LQIP placeholders
 * from the original media in public/media. Run via `npm run images`.
 */
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';
import { site } from '../src/data.js';

const SRC = 'public/media';
const OUT = join(SRC, 'opt');
const WIDTHS = [480, 800, 1200, 1600, 2000];

// The house green, matching --green in styles.css. Both logo lockups arrive as
// artwork on a flat field of *nearly* this colour; on a green navbar or plate a
// few points of drift shows up as a visible seam, so each one is pulled onto
// the exact token before anything else happens to it.
const HOUSE_GREEN = [0x4c, 0x63, 0x55];

/** Trims a logo's flat margin, then maps its field exactly onto HOUSE_GREEN. */
async function normaliseLogo(pipeline) {
  const trimmed = await pipeline.trim({ threshold: 6 }).toBuffer();
  // Top-left pixel is the field colour — the trim leaves the artwork inset.
  const { data } = await sharp(trimmed).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });

  // A per-channel linear map that sends the field to the token and holds 255
  // fixed, so the cream lettering and its antialiasing come through untouched.
  const a = HOUSE_GREEN.map((t, i) => (255 - t) / (255 - data[i]));
  const b = HOUSE_GREEN.map((t, i) => t - a[i] * data[i]);

  return sharp(trimmed).linear(a, b).toBuffer();
}

await mkdir(OUT, { recursive: true });

// og-cover.jpg is generated below — never treat it as a source.
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f) && !f.startsWith('og-'));
const manifest = {};

for (const file of files) {
  const { name } = parse(file);
  const input = join(SRC, file);
  // Logo lockups arrive with a wide flat margin baked in. Trimming it back to
  // the artwork lets them scale to a real size in a slim navbar — the green
  // field around them is then the navbar/footer itself.
  const isLogo = name.endsWith('-logo');
  const base = sharp(input).rotate();
  const image = isLogo ? sharp(await normaliseLogo(base)) : base;
  const { width, height } = await image.metadata();

  const widths = WIDTHS.filter((w) => w <= width);
  if (!widths.includes(width) && widths.length === 0) widths.push(width);

  // Flat colour with hairline strokes needs more bits than a photograph
  // before the fine script starts to smear.
  const opts = isLogo ? { quality: 94 } : { quality: 78 };

  for (const w of widths) {
    await image.clone().resize({ width: w }).webp(opts).toFile(join(OUT, `${name}-${w}.webp`));
    // Logos ship as WebP only. AVIF's limited-range YUV lands the flat field a
    // point off #4c6355 whatever the quality, and that one point is a visible
    // seam against the navbar — for two-tone artwork it saves nothing anyway.
    if (isLogo) continue;
    await image.clone().resize({ width: w }).avif({ quality: 55 }).toFile(join(OUT, `${name}-${w}.avif`));
  }

  // Low-quality image placeholder, inlined so nothing ever flashes empty.
  const lqip = await image.clone().resize({ width: 20 }).blur(1).webp({ quality: 30 }).toBuffer();

  manifest[name] = {
    width,
    height,
    aspect: +(width / height).toFixed(4),
    widths,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
  console.log(`✓ ${name} (${width}×${height}) → ${widths.join(', ')}`);
}

// Social card: 1200×630 crop of the first cover shot, whatever its extension.
const coverFile = files.find((f) => parse(f).name === site.covers[0].img);
if (!coverFile) throw new Error(`Cover source not found for ${site.covers[0].img}`);
await sharp(join(SRC, coverFile))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82 })
  .toFile(join(SRC, 'og-cover.jpg'));

// Maskable app icons from the studio avatar.
for (const size of [180, 192, 512]) {
  await sharp(join(SRC, 'avatar.jpg')).resize(size, size).png().toFile(`public/icon-${size}.png`);
}

await writeFile('src/media-manifest.json', JSON.stringify(manifest, null, 2));
console.log(`\nWrote src/media-manifest.json (${Object.keys(manifest).length} images) + og-cover.jpg + icons`);
