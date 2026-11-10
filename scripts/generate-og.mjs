// Generates public/og.png — the social share image shown when the site is
// linked on LinkedIn, Slack, iMessage, etc. Runs at the start of `npm run build`.
//
// It places the WPE logo (src/assets/og/wpe-logo-dark.jpg, a square image)
// full height in the middle of a 1200x630 card. Link previews are wide, so a
// square image on its own would get its top and bottom cropped. The sides of
// the card are filled with the logo's own charcoal background, and the logo's
// left and right edges fade into it so there is no visible seam.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const LOGO = path.join(ROOT, 'src/assets/og/wpe-logo-dark.jpg');

const WIDTH = 1200;
const HEIGHT = 630;
const FADE = 90; // px of fade on each side of the logo
// The logo's background colour: the average of its left and right edges.
const BACKGROUND = { r: 40, g: 43, b: 47 };

const logo = await sharp(LOGO).resize(HEIGHT, HEIGHT).removeAlpha().toBuffer();

// A mask that is opaque in the middle and fades to transparent at the left
// and right edges.
const stop = ((FADE / HEIGHT) * 100).toFixed(2);
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${HEIGHT}" height="${HEIGHT}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
        <stop offset="${stop}%" stop-color="#fff" stop-opacity="1"/>
        <stop offset="${100 - stop}%" stop-color="#fff" stop-opacity="1"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`
);
const alpha = await sharp(mask).extractChannel('alpha').raw().toBuffer();
const fadedLogo = await sharp(logo)
  .joinChannel(alpha, { raw: { width: HEIGHT, height: HEIGHT, channels: 1 } })
  .png()
  .toBuffer();

const outDir = path.join(ROOT, 'public');
fs.mkdirSync(outDir, { recursive: true });
await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 3, background: BACKGROUND },
})
  .composite([{ input: fadedLogo, left: Math.round((WIDTH - HEIGHT) / 2), top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(outDir, 'og.png'));
console.log('Wrote public/og.png');
