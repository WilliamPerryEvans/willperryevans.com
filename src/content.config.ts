import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * Content collections for the site. You edit Markdown and JSON files in
 * src/content/ and src/data/ — never the layout code — to add or change content.
 *
 * Dates: use YEARS only for display (e.g. "2018–2022"). `sortYear` is a number
 * used only to order items; it never shows on the page.
 */

// A reusable shape for an external link shown as a small icon/label on a card.
const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
  // Controls which small icon is shown next to the link.
  type: z.enum(['demo', 'source', 'video', 'report', 'site', 'article', 'book', 'map']).optional(),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      featured: z.boolean().default(false),
      // Explicit ordering for the three featured cards (lower shows first).
      // Non-featured projects order by sortYear (newest first).
      order: z.number().optional(),
      // Drafts never render anywhere on the site.
      draft: z.boolean().default(false),
      // Number used only for reverse-chronological ordering.
      sortYear: z.number(),
      // Human-readable year label, e.g. "2023–2024".
      years: z.string(),
      org: z.string(),
      role: z.string(),
      summary: z.string(),
      tags: z.array(z.string()).default([]),
      links: z.array(linkSchema).default([]),
      // Optional thumbnail. When absent, a neutral tinted card is shown.
      thumbnail: image().optional(),
      // Optional: which part of the thumbnail to keep when it is cropped to fit,
      // as a CSS position, e.g. "right center" or "30% 50%". Default is the center.
      thumbnailPosition: z.string().optional(),
      // Optional YouTube embed, rendered with a click-to-load facade.
      video: z
        .object({
          youtubeId: z.string(),
          caption: z.string(),
        })
        .optional(),
      // Optional short personal note in Will's own words. Left commented out in
      // the Markdown files until Will fills it in; renders on the card/detail page.
      in_my_words: z.string().optional(),
    }),
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
  schema: z.object({
    sortYear: z.number(),
    years: z.string(),
    title: z.string(),
    org: z.string(),
    location: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    link: z.string().optional(),
  }),
});

const writing = defineCollection({
  loader: file('./src/data/writing.json'),
  schema: z.object({
    // A short unique id for each row (e.g. "iran-2026"). Required by the loader.
    id: z.string(),
    title: z.string(),
    group: z.enum(['policy', 'refugee-bureau', 'earlier']),
    // Year or date label shown next to the entry.
    date: z.string(),
    url: z.string().optional(),
    note: z.string().optional(),
    // Optional thumbnail: a file name in src/assets/writing/ (e.g. "jordan-walk-tales.jpg"),
    // plus a short description of the image for screen readers.
    thumbnail: z.string().optional(),
    thumbnailAlt: z.string().optional(),
    // Lower numbers sort first within a group (optional).
    order: z.number().default(0),
  }),
});

export const collections = { projects, experience, writing };
