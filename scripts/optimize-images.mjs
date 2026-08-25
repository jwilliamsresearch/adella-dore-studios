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
const WIDTHS = [480, 800, 1200, 1600];

await mkdir(OUT, { recursive: true });

// og-cover.jpg is generated below — never treat it as a source.
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f) && !f.startsWith('og-'));
const manifest = {};

for (const file of files) {
  const { name } = parse(file);
  const input = join(SRC, file);
  const image = sharp(input).rotate();
  const { width, height } = await image.metadata();

  const widths = WIDTHS.filter((w) => w <= width);
  if (!widths.includes(width) && widths.length === 0) widths.push(width);

  for (const w of widths) {
    await image.clone().resize({ width: w }).webp({ quality: 78 }).toFile(join(OUT, `${name}-${w}.webp`));
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

// Social card: 1200×630 crop of the configured cover shot.
await sharp(join(SRC, `${site.cover.img}.jpg`))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82 })
  .toFile(join(SRC, 'og-cover.jpg'));

// Maskable app icons from the studio avatar.
for (const size of [180, 192, 512]) {
  await sharp(join(SRC, 'avatar.jpg')).resize(size, size).png().toFile(`public/icon-${size}.png`);
}

await writeFile('src/media-manifest.json', JSON.stringify(manifest, null, 2));
console.log(`\nWrote src/media-manifest.json (${Object.keys(manifest).length} images) + og-cover.jpg + icons`);
