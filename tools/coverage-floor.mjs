// Per-file coverage floor, on top of the global gates in project.json (95 % statements/functions/lines,
// 90 % branches). It keeps a weakly tested file from hiding behind well-tested ones. The floor is lower
// than the global gate because Angular's compiled signal queries (viewChild, contentChildren) count as
// functions that never run, which weighs heavily in small files.
// Usage: node tools/coverage-floor.mjs [coverage/ng-liquid-glass/coverage-summary.json]
import { readFileSync } from 'node:fs';

const FLOOR = { statements: 90, lines: 90, functions: 85, branches: 85 };
const file = process.argv[2] ?? 'coverage/ng-liquid-glass/coverage-summary.json';
const summary = JSON.parse(readFileSync(file, 'utf8'));
const failures = Object.entries(summary)
  .filter(([path]) => path !== 'total')
  .flatMap(([path, metrics]) =>
    Object.entries(FLOOR)
      .filter(([metric, floor]) => metrics[metric].total > 0 && metrics[metric].pct < floor)
      .map(
        ([metric, floor]) => `${path.replace(`${process.cwd()}/`, '')}: ${metric} ${String(metrics[metric].pct)} % < ${String(floor)} %`,
      ),
  );
if (failures.length > 0) {
  console.error(`Files below the per-file coverage floor:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(
  `Every file meets the per-file coverage floor (${Object.entries(FLOOR)
    .map(([m, f]) => `${m} ${String(f)} %`)
    .join(', ')}).`,
);
