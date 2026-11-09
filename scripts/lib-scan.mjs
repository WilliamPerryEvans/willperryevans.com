// Shared scanner for [PLACEHOLDER ...] markers in editable content.
//
// We only scan the folders where you write content and configuration:
//   src/content, src/data, src/pages
// (Layout/component/library code is not scanned, so helper code that mentions
// the word placeholder is never mistaken for a real one.)

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['src/content', 'src/data', 'src/pages'];
const EXTENSIONS = new Set(['.md', '.astro', '.ts', '.json']);
const PLACEHOLDER_RE = /\[PLACEHOLDER[^\]]*\]/g;

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(path.extname(entry.name))) out.push(full);
  }
}

function frontmatterInfo(lines) {
  // Returns { start, end, isDraft } for a Markdown file, or null.
  if (lines[0]?.trim() !== '---') return null;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      const fm = lines.slice(1, i).join('\n');
      return { start: 0, end: i, isDraft: /^\s*draft:\s*true\s*$/m.test(fm) };
    }
  }
  return null;
}

/**
 * Scan all content/data/pages files.
 * @returns {{file:string, line:number, match:string, blocking:boolean, draft:boolean}[]}
 */
export function scan() {
  const files = [];
  for (const d of SCAN_DIRS) walk(path.join(ROOT, d), files);
  files.sort();

  const results = [];
  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const raw = fs.readFileSync(file, 'utf8');
    const lines = raw.split(/\r?\n/);
    const isMd = path.extname(file) === '.md';
    const fm = isMd ? frontmatterInfo(lines) : null;
    const draft = fm?.isDraft ?? false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(PLACEHOLDER_RE);
      if (!matches) continue;

      // A YAML comment line inside Markdown frontmatter (starts with #) is a
      // note to yourself, not visible content — never blocking.
      const inFrontmatter = fm && i > fm.start && i < fm.end;
      const isYamlComment = inFrontmatter && /^\s*#/.test(line);

      const blocking = !draft && !isYamlComment;
      for (const match of matches) {
        results.push({ file: rel, line: i + 1, match, blocking, draft });
      }
    }
  }
  return results;
}
