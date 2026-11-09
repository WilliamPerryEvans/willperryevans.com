// Generates PLACEHOLDERS.md at the repo root: a to-do list of every remaining
// [PLACEHOLDER ...] marker, with its file, line, and description.

import fs from 'node:fs';
import path from 'node:path';
import { scan } from './lib-scan.mjs';

const results = scan();
const generatedAt = new Date().toISOString().slice(0, 10);

const byFile = new Map();
for (const r of results) {
  if (!byFile.has(r.file)) byFile.set(r.file, []);
  byFile.get(r.file).push(r);
}

const blockingCount = results.filter((r) => r.blocking).length;
const nonBlockingCount = results.length - blockingCount;

let md = `# Placeholders to fill in\n\n`;
md += `_Generated ${generatedAt} by \`npm run placeholders:list\`._\n\n`;

if (results.length === 0) {
  md += `🎉 Nothing left — there are no placeholders in your content.\n`;
} else {
  md += `There are **${results.length}** placeholder(s) remaining: `;
  md += `**${blockingCount}** that block the build (visible on the site) and `;
  md += `**${nonBlockingCount}** optional (in drafts or in notes to yourself).\n\n`;
  md += `The build will not deploy while any blocking placeholder remains.\n\n`;

  for (const [file, items] of byFile) {
    md += `### \`${file}\`\n\n`;
    for (const r of items) {
      const flag = r.blocking ? '**blocks build**' : r.draft ? '_draft_' : '_optional note_';
      md += `- Line ${r.line} — ${flag}: \`${r.match}\`\n`;
    }
    md += `\n`;
  }
}

fs.writeFileSync(path.join(process.cwd(), 'PLACEHOLDERS.md'), md, 'utf8');
console.log(`Wrote PLACEHOLDERS.md (${results.length} placeholder(s): ${blockingCount} blocking).`);
