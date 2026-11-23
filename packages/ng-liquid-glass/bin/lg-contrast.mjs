#!/usr/bin/env node
// Checks the contrast of the ng-liquid-glass theme tokens, with your overrides applied, in light and dark mode:
// text pairs need 7:1 (WCAG 1.4.6, AAA), borders and the focus ring 3:1 (WCAG 1.4.11).
//
//   npx lg-contrast                       the library theme
//   npx lg-contrast src/brand.css         the theme with your :root { --lg-…: … } overrides
//
// Exits with 1 when a pair fails. Only top-level `:root { … }` declarations are read; values may be hex,
// rgb()/rgba(), light-dark(light, dark) or var(--lg-…).
import { readFileSync } from 'node:fs';

const THEME = new URL('../styles/theme.css', import.meta.url);

/** [foreground, background, minimum ratio, what it is] */
const PAIRS = [
  ...['bg', 'surface', 'surface-muted'].flatMap((bg) => [
    ['fg', bg, 7, 'body text'],
    ['fg-muted', bg, 7, 'secondary text'],
  ]),
  ['on-primary', 'primary', 7, 'primary button text'],
  ['on-primary', 'primary-hover', 7, 'primary button text, hovered'],
  ['on-accent', 'accent', 7, 'accent button text'],
  ['on-accent', 'accent-hover', 7, 'accent button text, hovered'],
  ['accent', 'bg', 7, 'accent text'],
  ['accent', 'surface', 7, 'accent text on surfaces'],
  ['accent', 'accent-surface', 7, 'accent text on its tint'],
  ...['info', 'success', 'warning', 'danger'].flatMap((status) => [
    [status, `${status}-surface`, 7, `${status} text on its tint`],
    [status, 'bg', 7, `${status} text`],
  ]),
  ['on-danger', 'danger', 7, 'danger button text'],
  ['control-border', 'bg', 3, 'control borders'],
  ['control-border', 'surface', 3, 'control borders on surfaces'],
  ['focus', 'bg', 3, 'focus ring'],
  ['focus', 'surface', 3, 'focus ring on surfaces'],
];

function rootDeclarations(css) {
  // Drop comments and @media blocks (e.g. prefers-contrast), then read the top-level :root blocks.
  const flat = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const tokens = {};
  for (const block of flat.matchAll(/^\s*:root\s*\{([^}]*)\}/gm)) {
    for (const [, name, value] of block[1].matchAll(/--lg-([\w-]+)\s*:\s*([^;]+);/g)) tokens[name] = value.trim();
  }
  return tokens;
}

function parseColor(text) {
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(text);
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((d) => d + d).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)).concat(1);
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/i.exec(text);
  if (rgb) {
    const alpha = rgb[4] === undefined ? 1 : rgb[4].endsWith('%') ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), alpha];
  }
  throw new Error(`Unsupported colour "${text}"`);
}

/** The token's colour in a mode (0 = light, 1 = dark), following var() references. */
function resolve(tokens, name, mode, seen = new Set()) {
  if (seen.has(name)) throw new Error(`Circular reference in --lg-${name}`);
  seen.add(name);
  const value = tokens[name];
  if (value === undefined) throw new Error(`--lg-${name} is not defined`);
  const reference = /^var\(--lg-([\w-]+)\)$/.exec(value);
  if (reference) return resolve(tokens, reference[1], mode, seen);
  const pair = /^light-dark\((.+)\)$/.exec(value);
  if (pair) {
    const parts = pair[1].split(/,(?![^(]*\))/).map((part) => part.trim());
    const chosen = parts[mode];
    const inner = /^var\(--lg-([\w-]+)\)$/.exec(chosen);
    return inner ? resolve(tokens, inner[1], mode, seen) : parseColor(chosen);
  }
  return parseColor(value);
}

const luminance = ([r, g, b]) => {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
/** Blends a translucent colour over an opaque one. */
const over = ([r, g, b, a], [br, bg, bb]) => [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a), 1];
const ratio = (fg, bg) => {
  const [a, b] = [luminance(fg), luminance(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const files = process.argv.slice(2);
const tokens = Object.assign(
  {},
  rootDeclarations(readFileSync(THEME, 'utf8')),
  ...files.map((file) => rootDeclarations(readFileSync(file, 'utf8'))),
);

const failures = [];
const rows = [];
for (const [mode, label] of [
  [0, 'light'],
  [1, 'dark'],
]) {
  const page = resolve(tokens, 'bg', mode);
  for (const [fg, bg, min, what] of PAIRS) {
    const background = over(resolve(tokens, bg, mode), page);
    const value = ratio(over(resolve(tokens, fg, mode), background), background);
    const ok = value >= min;
    rows.push(
      `${ok ? '✓' : '✗'} ${label.padEnd(5)} ${`--lg-${fg} on --lg-${bg}`.padEnd(46)} ${value.toFixed(2).padStart(5)}:1 (≥ ${String(min)}:1, ${what})`,
    );
    if (!ok) failures.push(rows.at(-1));
  }
}

console.log(rows.join('\n'));
if (failures.length > 0) {
  console.error(`\n${String(failures.length)} pair(s) below the minimum:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`\nAll ${String(rows.length)} pairs pass${files.length > 0 ? ` with ${files.join(', ')}` : ''}.`);
