// Fails the build if any *visible* (non-draft, non-comment) content still
// contains a [PLACEHOLDER ...] marker. Run automatically before `npm run build`
// and in the GitHub Action, so the site can never deploy with a visible
// placeholder on the page.

import { scan } from './lib-scan.mjs';

const blocking = scan().filter((r) => r.blocking);

if (blocking.length === 0) {
  console.log('✓ No visible placeholders found. Safe to build.');
  process.exit(0);
}

console.error(`\n✗ Found ${blocking.length} visible placeholder(s) that must be filled or removed:\n`);
let currentFile = '';
for (const r of blocking) {
  if (r.file !== currentFile) {
    currentFile = r.file;
    console.error(`  ${r.file}`);
  }
  console.error(`    line ${r.line}: ${r.match}`);
}
console.error(
  '\nFill these in (or delete the optional ones), then run `npm run build` again.' +
    '\nRun `npm run placeholders:list` to regenerate PLACEHOLDERS.md as a to-do list.\n'
);
process.exit(1);
