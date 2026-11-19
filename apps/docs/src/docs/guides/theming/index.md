The theme is a set of CSS custom properties in `theme.css`, exposed to Tailwind as colours (`bg-lg-surface`, `text-lg-fg`, …) and radii (`rounded-lg-control`, `rounded-lg-surface`).

## Light and dark mode

Tokens use CSS `light-dark()`, so they follow the operating system by default. To force a mode, set `data-theme` on `<html>`:

```html
<html data-theme="dark"></html>
```

## Tokens

Every text/background pair meets **7:1** (WCAG 1.4.6 Contrast Enhanced, AAA) in both modes.

| Token                                           | Use                                    |
| ----------------------------------------------- | -------------------------------------- |
| `--lg-bg`, `--lg-surface`, `--lg-surface-muted` | Page, cards, subtle fills              |
| `--lg-fg`, `--lg-fg-muted`                      | Body text, secondary text (≥ 9.5:1)    |
| `--lg-border`                                   | Decorative separators                  |
| `--lg-control-border`                           | Borders of inputs and controls (≥ 3:1) |
| `--lg-primary`, `--lg-on-primary`               | Primary actions, selection             |
| `--lg-focus`                                    | The focus ring                         |
| `--lg-{info,success,warning,danger}`            | Status text and icons                  |
| `--lg-{info,success,warning,danger}-surface`    | Status backgrounds                     |
| `--lg-glass`, `--lg-glass-border`               | The frosted glass material             |

Override any token after importing the theme. Keep the 7:1 ratio if you need AAA:

```css
:root {
  --lg-primary: light-dark(#1e3a8a, #bfdbfe);
  --lg-on-primary: light-dark(#ffffff, #172554);
}
```

## The glass material

`lg-glass` is a utility for floating surfaces (menus, dialogs, toasts, tooltips): a 92 % opaque background with blur. It is opaque enough to keep AAA contrast over any content, and becomes solid under `prefers-reduced-transparency: reduce`.

## Focus

`lg-focus-ring` draws a 3 px solid outline with a 2 px offset in `--lg-focus`, meeting WCAG 2.4.13 Focus Appearance (AAA). Use it on your own interactive elements too.
