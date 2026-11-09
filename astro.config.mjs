// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The public site URL. Used for canonical links, sitemap, Open Graph, and JSON-LD.
export default defineConfig({
  site: 'https://willperryevans.com',
  // Fully static output (the default). Deployed to GitHub Pages.
  integrations: [sitemap()],
  // Keep client JS to an absolute minimum; we only ship the theme toggle and nav highlight.
  build: {
    // Inline tiny scripts/styles to reduce requests and help Lighthouse.
    inlineStylesheets: 'auto',
  },
});
