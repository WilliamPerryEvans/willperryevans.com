import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';

export type Project = CollectionEntry<'projects'>;
export type Experience = CollectionEntry<'experience'>;
export type Writing = CollectionEntry<'writing'>;

/** True when a value is an unfilled placeholder, e.g. "[PLACEHOLDER: ...]". */
export function isPlaceholder(value?: string | null): boolean {
  return typeof value === 'string' && value.includes('[PLACEHOLDER');
}

/** A usable (non-placeholder, non-empty) external link. */
export function isRealUrl(value?: string | null): value is string {
  return typeof value === 'string' && value.length > 0 && !isPlaceholder(value);
}

/** Non-draft projects, split into the three featured cards and the rest. */
export async function getProjects(): Promise<{ featured: Project[]; more: Project[] }> {
  const all = (await getCollection('projects')).filter((p) => !p.data.draft);
  const featured = all
    .filter((p) => p.data.featured)
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  const more = all
    .filter((p) => !p.data.featured)
    .sort((a, b) => b.data.sortYear - a.data.sortYear);
  return { featured, more };
}

/** All projects whose Markdown has body text get a detail page. */
export async function getProjectsWithBody(): Promise<Project[]> {
  const all = (await getCollection('projects')).filter((p) => !p.data.draft);
  const withBody: Project[] = [];
  for (const p of all) {
    if ((p.body ?? '').trim().length > 0) withBody.push(p);
  }
  return withBody;
}

/** Experience entries, newest first. */
export async function getExperience(): Promise<Experience[]> {
  const all = await getCollection('experience');
  return all.sort((a, b) => b.data.sortYear - a.data.sortYear);
}

export interface WritingGroup {
  key: keyof typeof site.writingGroups;
  label: string;
  description: string;
  items: Writing[];
}

/** Writing entries grouped in display order. */
export async function getWritingGroups(): Promise<WritingGroup[]> {
  const all = await getCollection('writing');
  const order: (keyof typeof site.writingGroups)[] = ['policy', 'earlier'];
  return order.map((key) => ({
    key,
    label: site.writingGroups[key].label,
    description: site.writingGroups[key].description,
    items: all
      .filter((w) => w.data.group === key)
      .sort((a, b) => a.data.order - b.data.order),
  }));
}
