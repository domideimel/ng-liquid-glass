// Builds the PR report (bundle size and coverage, with deltas against the base branch) as Markdown.
// Usage: node tools/pr-report.mjs <current reports dir> [<base reports dir>] > report.md
// A reports dir holds size-report.json (tools/size-report.mjs) and coverage-summary.json (Vitest json-summary).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [currentDir, baseDir] = process.argv.slice(2);
if (!currentDir) {
  console.error('Usage: node tools/pr-report.mjs <current reports dir> [<base reports dir>]');
  process.exit(2);
}

const read = (dir, file) => (dir && existsSync(join(dir, file)) ? JSON.parse(readFileSync(join(dir, file), 'utf8')) : null);
const size = read(currentDir, 'size-report.json');
const baseSize = read(baseDir, 'size-report.json');
const coverage = read(currentDir, 'coverage-summary.json')?.total;
const baseCoverage = read(baseDir, 'coverage-summary.json')?.total;

const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;
const signedKb = (bytes) => (bytes === 0 ? '±0' : `${bytes > 0 ? '+' : '−'}${kb(Math.abs(bytes))}`);
const signedPct = (pct) => (Math.abs(pct) < 0.005 ? '±0' : `${pct > 0 ? '+' : '−'}${Math.abs(pct).toFixed(2)} pp`);

const lines = ['<!-- pr-report -->', '## Bundle size and coverage', ''];
if (!baseSize && !baseCoverage) lines.push('_No report from the base branch yet, so no deltas._', '');

if (size) {
  const baseRows = new Map((baseSize?.rows ?? []).map((row) => [row.entry, row.gzip]));
  const changed = size.rows.filter((row) => !baseSize || baseRows.get(row.entry) !== row.gzip);
  const largest = size.rows.reduce((max, row) => (row.gzip > max.gzip ? row : max), size.rows[0]);
  lines.push(
    `**Total: ${kb(size.total)}** gzipped` +
      (baseSize ? ` (${signedKb(size.total - baseSize.total)} vs. base)` : '') +
      `. Largest entry point: \`${largest.entry}\` with ${kb(largest.gzip)} of the ${kb(size.budgetPerEntry ?? size.budget)} per-entry budget.`,
    '',
  );
  if (baseSize && changed.length === 0) {
    lines.push('No entry point changed size.', '');
  } else {
    lines.push('| Entry point | Gzip | Δ |', '| --- | ---: | ---: |');
    for (const row of changed) {
      const before = baseRows.get(row.entry);
      lines.push(`| \`${row.entry}\` | ${kb(row.gzip)} | ${before === undefined ? 'new' : signedKb(row.gzip - before)} |`);
    }
    lines.push('');
  }
}

if (coverage) {
  lines.push('| Coverage | % | Δ |', '| --- | ---: | ---: |');
  for (const metric of ['statements', 'branches', 'functions', 'lines']) {
    const pct = coverage[metric].pct;
    const before = baseCoverage?.[metric]?.pct;
    lines.push(`| ${metric} | ${pct.toFixed(2)} | ${before === undefined ? '–' : signedPct(pct - before)} |`);
  }
  lines.push('');
}

console.log(lines.join('\n'));
