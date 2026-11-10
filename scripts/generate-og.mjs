// Generates public/og.jpg — the social share image shown when the site is
// linked on LinkedIn, Slack, iMessage, etc. Runs at the start of `npm run build`.
//
// It places the WPE logo (src/assets/og/wpe-logo-dark.jpg, a square image)
// in the middle of a 1200x630 card, zoomed in slightly (ZOOM) so the letters
// stay readable when WhatsApp shrinks the card to a ~100px square thumbnail.
// The sides of the card are filled with the logo's own charcoal background,
// which matches closely enough that no seam shows (no fade needed).

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const LOGO = path.join(ROOT, 'src/assets/og/wpe-logo-dark.jpg');

const WIDTH = 1200;
const HEIGHT = 630;
// Fraction of the logo kept, centred: 1 = whole logo, 0.8 = trims the outer
// leaf tips so the medallion fills the card's height.
const ZOOM = 0.8;
// A slight blur. The logo's engraving is made of hairlines, and WhatsApp
// shrinks the card to ~100px with a crude resize, which turns them into a
// scratchy mess. Softening them first keeps the thumbnail clean; at the size
// LinkedIn and others display the card (~550px wide) it is barely visible.
const SOFTEN = 1.4;
// The logo's background colour: the average of its left and right edges.
const BACKGROUND = { r: 40, g: 43, b: 47 };

const { width: logoSize } = await sharp(LOGO).metadata();
const keep = Math.round(logoSize * ZOOM);
const offset = Math.round((logoSize - keep) / 2);
const logo = await sharp(LOGO)
  .extract({ left: offset, top: offset, width: keep, height: keep })
  .resize(HEIGHT, HEIGHT)
  .blur(SOFTEN)
  .toBuffer();

const outDir = path.join(ROOT, 'public');
fs.mkdirSync(outDir, { recursive: true });
await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 3, background: BACKGROUND },
})
  .composite([{ input: logo, left: Math.round((WIDTH - HEIGHT) / 2), top: 0 }])
  // JPEG, not PNG: the textured background makes a PNG ~490 KB, and WhatsApp
  // drops preview images over roughly 300 KB. This comes out around 60 KB.
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(path.join(outDir, 'og.jpg'));
console.log('Wrote public/og.jpg');
