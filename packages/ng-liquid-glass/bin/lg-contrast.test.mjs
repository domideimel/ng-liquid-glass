// Tests the lg-contrast checker. Run by `nx run ng-liquid-glass:test-schematics`.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('./lg-contrast.mjs', import.meta.url));
const run = (...files) => spawnSync(process.execPath, [SCRIPT, ...files], { encoding: 'utf8' });
const override = (css) => {
  const file = join(mkdtempSync(join(tmpdir(), 'lg-contrast-')), 'brand.css');
  writeFileSync(file, css);
  return file;
};

describe('lg-contrast', () => {
  it('passes the library theme in light and dark mode', () => {
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /All \d+ pairs pass\./);
    assert.match(result.stdout, /✓ dark {2}--lg-fg on --lg-bg/);
  });

  it('fails a weak override and names the pairs', () => {
    const result = run(override(':root {\n  --lg-accent: light-dark(#60a5fa, #1e3a8a);\n}\n'));
    assert.equal(result.status, 1);
    assert.match(result.stderr, /✗ light --lg-accent on --lg-bg/);
    assert.match(result.stderr, /✗ dark {2}--lg-accent on --lg-bg/);
  });

  it('reads hex, rgb(), var() and ignores @media blocks and comments', () => {
    const result = run(
      override(`/* :root { --lg-fg: #fff; } */
@media (prefers-contrast: more) { :root { --lg-fg: #777; } }
:root {
  --lg-primary: light-dark(#000, rgb(250 250 250));
  --lg-primary-hover: var(--lg-primary);
}
`),
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /--lg-on-primary on --lg-primary-hover/);
  });

  it('reports unknown colours clearly', () => {
    const result = run(override(':root {\n  --lg-accent: hsl(220 80% 30%);\n}\n'));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unsupported colour "hsl\(220 80% 30%\)"/);
  });
});
