// Generates public/og.png — the social share image: the name and title on the
// accent color. Runs at the start of `npm run build`. Uses satori (which turns
// text into vector paths, so no system fonts are needed) plus sharp to
// rasterize to PNG.

import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const ROOT = process.cwd();

// Keep the share image in sync with the sidebar text in src/data/site.ts.
const siteSrc = fs.readFileSync(path.join(ROOT, 'src/data/site.ts'), 'utf8');
const name = siteSrc.match(/name:\s*'([^']+)'/)?.[1] ?? 'Will Perry Evans';
const title = siteSrc.match(/headline:\s*'([^']+)'/)?.[1] ?? '';

const fontRegular = fs.readFileSync(
  path.join(ROOT, 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
);
const fontBold = fs.readFileSync(
  path.join(ROOT, 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
);

const ACCENT = '#4a5b52';
const PAPER = '#faf9f6';

const element = {
  type: 'div',
  props: {
    style: {
      height: '630px',
      width: '1200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: ACCENT,
      color: PAPER,
      padding: '80px',
      fontFamily: 'Inter',
    },
    children: [
      {
        type: 'div',
        props: {
          style: { fontSize: 30, opacity: 0.82, marginBottom: 28 },
          children: 'willperryevans.com',
        },
      },
      {
        type: 'div',
        props: {
          style: {
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          },
          children: name,
        },
      },
      {
        type: 'div',
        props: {
          style: { fontSize: 36, marginTop: 24, opacity: 0.92, maxWidth: 960, lineHeight: 1.3 },
          children: title,
        },
      },
    ],
  },
};

const svg = await satori(element, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
    { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
  ],
});

const outDir = path.join(ROOT, 'public');
fs.mkdirSync(outDir, { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'og.png'));
console.log('Wrote public/og.png');
