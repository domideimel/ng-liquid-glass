The theme is a set of CSS custom properties in `theme.css`, exposed to Tailwind as colours (`bg-lg-surface`, `text-lg-fg`, …) and radii (`rounded-lg-control`, `rounded-lg-surface`).

## Light and dark mode

Tokens use CSS `light-dark()`, so they follow the operating system by default. To force a mode, set `data-theme` on `<html>`:

```html
<html data-theme="dark"></html>
```

## Tokens

Every text/background pair meets **7:1** (WCAG 1.4.6 Contrast Enhanced, AAA) in both modes.

| Token                                           | Use                                                        |
| ----------------------------------------------- | ---------------------------------------------------------- |
| `--lg-bg`, `--lg-surface`, `--lg-surface-muted` | Page, cards, subtle fills                                  |
| `--lg-fg`, `--lg-fg-muted`                      | Body text, secondary text (≥ 9.5:1)                        |
| `--lg-border`                                   | Decorative separators                                      |
| `--lg-control-border`                           | Borders of inputs and controls (≥ 3:1)                     |
| `--lg-primary`, `--lg-on-primary`               | Primary actions, selection                                 |
| `--lg-accent`, `--lg-on-accent`                 | Brand colour: `variant="accent"` buttons                   |
| `--lg-accent-surface`                           | Accent tint, e.g. selected chips (accent text on it ≥ 7:1) |
| `--lg-focus`                                    | The focus ring                                             |
| `--lg-{info,success,warning,danger}`            | Status text and icons                                      |
| `--lg-{info,success,warning,danger}-surface`    | Status backgrounds                                         |
| `--lg-glass`, `--lg-glass-border`               | The frosted glass material                                 |

Override any token after importing the theme; the accent is the usual place for a brand colour. Keep the 7:1 ratio if you need AAA:

```css
:root {
  --lg-accent: light-dark(#6b21a8, #e9d5ff);
  --lg-on-accent: light-dark(#ffffff, #3b0764);
  --lg-accent-hover: light-dark(#581c87, #f3e8ff);
}
```

## Accent presets

Ready-made, AAA-checked accent palettes for brands that aren't blue. Import one after the theme:

```css
@import 'tailwindcss';
@import '@domideimel/ng-liquid-glass/theme.css';
@import '@domideimel/ng-liquid-glass/presets/amber.css';
```

| Preset   | Light accent | Dark accent |
| -------- | ------------ | ----------- |
| `amber`  | `#78350f`    | `#fcd34d`   |
| `green`  | `#14532d`    | `#86efac`   |
| `violet` | `#5b21b6`    | `#c4b5fd`   |
| `rose`   | `#9f1239`    | `#fda4af`   |

## Check your overrides

`lg-contrast` checks every text pair (≥ 7:1) and the control borders and focus ring (≥ 3:1) of the theme with your overrides applied, in light and dark mode. It exits with an error when a pair fails, so it can run in CI:

```bash
npx lg-contrast src/brand.css
```

It reads top-level `:root { --lg-…: … }` declarations with hex, `rgb()`, `light-dark()` or `var(--lg-…)` values.

## Display typography

For very large numbers and headlines: `text-lg-display-sm` (2.25rem), `-md` (3.5rem), `-lg` (5rem) and `-xl` (7rem), with matching line heights. Add `tabular-nums` to numbers that change, so their width stays the same:

```html
<p class="text-lg-display-xl font-semibold tabular-nums">120</p>
```

## The glass material

`lg-glass` is a utility for floating surfaces (menus, dialogs, toasts, tooltips): a 92 % opaque background with blur. It is opaque enough to keep AAA contrast over any content, and becomes solid under `prefers-reduced-transparency: reduce`.

## High contrast and forced colors

- **`prefers-contrast: more`:** muted text becomes full-strength text, borders use the control border colour, and the glass material turns opaque. Nothing to configure.
- **Forced colors (Windows High Contrast):** the system palette replaces the theme. Selected states (tab, page, combobox option) switch to the system `Highlight` colours, progress bars and meters render natively, and buttons keep a visible border.

## Safe areas

For installed PWAs and notched screens, `lg-safe-top`, `lg-safe-bottom` and `lg-safe-inline` pad an element by the matching `env(safe-area-inset-*)`, e.g. an app bar or a bottom navigation. They need `viewport-fit=cover`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Bottom sheets (`lg-dialog placement="bottom"` or `"sheet"`) pad the bottom inset themselves.

## Right-to-left

The components use logical properties (`ps-*`, `border-s-*`, `start-*`), so they mirror under `dir="rtl"` on `<html>` or any ancestor. Arrow keys in tabs follow the reading direction.

## Focus

`lg-focus-ring` draws a 3 px solid outline with a 2 px offset in `--lg-focus`, meeting WCAG 2.4.13 Focus Appearance (AAA). Use it on your own interactive elements too.
