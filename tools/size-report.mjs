// Reports the gzipped size of every entry point of the built library and fails above the budget.
import { appendFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_BYTES = 40 * 1024;
const dir = 'dist/packages/ng-liquid-glass/fesm2022';
const rows = readdirSync(dir)
  .filter((file) => file.endsWith('.mjs'))
  .map((file) => {
    const source = readFileSync(join(dir, file));
    const subpath = file.replace('domideimel-ng-liquid-glass', '').replace('.mjs', '').replace(/^-/, '/');
    return { entry: `@domideimel/ng-liquid-glass${subpath}`, raw: source.length, gzip: gzipSync(source).length };
  });
const total = rows.reduce((sum, row) => sum + row.gzip, 0);
const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;
const table = [
  '## Bundle size',
  '',
  '| Entry point | Raw | Gzip |',
  '| --- | ---: | ---: |',
  ...rows.map((row) => `| \`${row.entry}\` | ${kb(row.raw)} | ${kb(row.gzip)} |`),
  `| **All entry points** | | **${kb(total)}** (budget ${kb(BUDGET_BYTES)}) |`,
].join('\n');

console.log(table);
mkdirSync('dist/reports', { recursive: true });
writeFileSync('dist/reports/size-report.json', `${JSON.stringify({ budget: BUDGET_BYTES, total, rows }, null, 2)}\n`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${table}\n`);
if (total > BUDGET_BYTES) {
  console.error(`Bundle size ${kb(total)} exceeds the budget of ${kb(BUDGET_BYTES)}.`);
  process.exit(1);
}
