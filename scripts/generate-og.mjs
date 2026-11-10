// Generates public/og.jpg — the social share image shown when the site is
// linked on LinkedIn, Slack, iMessage, etc. Runs at the start of `npm run build`.
//
// It places the WPE logo (src/assets/og/wpe-logo.jpg, a square image) in the
// middle of a 1200x630 card, zoomed in slightly (ZOOM) so it stays readable
// when WhatsApp shrinks the card to a ~100px square thumbnail. Keep the logo
// bold and simple: WhatsApp's crude resize turns fine hairlines scratchy.
// The sides of the card are filled with the logo's own charcoal background,
// which matches closely enough that no seam shows (no fade needed).

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const LOGO = path.join(ROOT, 'src/assets/og/wpe-logo.jpg');

const WIDTH = 1200;
const HEIGHT = 630;
// Fraction of the logo kept, centred: 1 = whole logo. 0.85 trims the empty
// margin so the ring nearly fills the card's height.
const ZOOM = 0.85;
// The logo's background colour: the average of its left and right edges.
const BACKGROUND = { r: 48, g: 49, b: 55 };

const { width: logoSize } = await sharp(LOGO).metadata();
const keep = Math.round(logoSize * ZOOM);
const offset = Math.round((logoSize - keep) / 2);
const logo = await sharp(LOGO)
  .extract({ left: offset, top: offset, width: keep, height: keep })
  .resize(HEIGHT, HEIGHT)
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
