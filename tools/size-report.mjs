// Reports the gzipped size of every entry point of the built library and fails when one exceeds its budget.
// The budget is per entry point because apps only ship the entry points they import; the total is informational.
import { appendFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_PER_ENTRY_BYTES = 5 * 1024;
const dir = 'dist/packages/ng-liquid-glass/fesm2022';
const rows = readdirSync(dir)
  .filter((file) => file.endsWith('.mjs'))
  // Test harnesses only run in consumers' tests, never in their apps.
  .filter((file) => !file.endsWith('-testing.mjs'))
  .map((file) => {
    const source = readFileSync(join(dir, file));
    const subpath = file.replace('domideimel-ng-liquid-glass', '').replace('.mjs', '').replace(/^-/, '/');
    return { entry: `@domideimel/ng-liquid-glass${subpath}`, raw: source.length, gzip: gzipSync(source).length };
  });
const total = rows.reduce((sum, row) => sum + row.gzip, 0);
const overBudget = rows.filter((row) => row.gzip > BUDGET_PER_ENTRY_BYTES);
const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;
const table = [
  '## Bundle size',
  '',
  `Budget: ${kb(BUDGET_PER_ENTRY_BYTES)} gzipped per entry point.`,
  '',
  '| Entry point | Raw | Gzip |',
  '| --- | ---: | ---: |',
  ...rows.map((row) => `| \`${row.entry}\` | ${kb(row.raw)} | ${kb(row.gzip)}${row.gzip > BUDGET_PER_ENTRY_BYTES ? ' ❌' : ''} |`),
  `| **All entry points** | | **${kb(total)}** |`,
].join('\n');

console.log(table);
mkdirSync('dist/reports', { recursive: true });
writeFileSync('dist/reports/size-report.json', `${JSON.stringify({ budgetPerEntry: BUDGET_PER_ENTRY_BYTES, total, rows }, null, 2)}\n`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${table}\n`);
if (overBudget.length > 0) {
  console.error(
    `Over the ${kb(BUDGET_PER_ENTRY_BYTES)} per-entry budget: ${overBudget.map((row) => `${row.entry} (${kb(row.gzip)})`).join(', ')}.`,
  );
  process.exit(1);
}
