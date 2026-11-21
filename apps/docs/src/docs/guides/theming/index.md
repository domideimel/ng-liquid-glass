The theme is a set of CSS custom properties in `theme.css`, exposed to Tailwind as colours (`bg-lg-surface`, `text-lg-fg`, …) and radii (`rounded-lg-control`, `rounded-lg-surface`).

## Light and dark mode

Tokens use CSS `light-dark()`, so they follow the operating system by default. To force a mode, set `data-theme` on `<html>`:

```html
<html data-theme="dark"></html>
```

## Tokens

Every text/background pair meets **7:1** (WCAG 1.4.6 Contrast Enhanced, AAA) in both modes.

| Token                                           | Use                                      |
| ----------------------------------------------- | ---------------------------------------- |
| `--lg-bg`, `--lg-surface`, `--lg-surface-muted` | Page, cards, subtle fills                |
| `--lg-fg`, `--lg-fg-muted`                      | Body text, secondary text (≥ 9.5:1)      |
| `--lg-border`                                   | Decorative separators                    |
| `--lg-control-border`                           | Borders of inputs and controls (≥ 3:1)   |
| `--lg-primary`, `--lg-on-primary`               | Primary actions, selection               |
| `--lg-accent`, `--lg-on-accent`                 | Brand colour: `variant="accent"` buttons |
| `--lg-focus`                                    | The focus ring                           |
| `--lg-{info,success,warning,danger}`            | Status text and icons                    |
| `--lg-{info,success,warning,danger}-surface`    | Status backgrounds                       |
| `--lg-glass`, `--lg-glass-border`               | The frosted glass material               |

Override any token after importing the theme; the accent is the usual place for a brand colour. Keep the 7:1 ratio if you need AAA:

```css
:root {
  --lg-accent: light-dark(#6b21a8, #e9d5ff);
  --lg-on-accent: light-dark(#ffffff, #3b0764);
  --lg-accent-hover: light-dark(#581c87, #f3e8ff);
}
```

## The glass material

`lg-glass` is a utility for floating surfaces (menus, dialogs, toasts, tooltips): a 92 % opaque background with blur. It is opaque enough to keep AAA contrast over any content, and becomes solid under `prefers-reduced-transparency: reduce`.

## High contrast and forced colors

- **`prefers-contrast: more`:** muted text becomes full-strength text, borders use the control border colour, and the glass material turns opaque. Nothing to configure.
- **Forced colors (Windows High Contrast):** the system palette replaces the theme. Selected states (tab, page, combobox option) switch to the system `Highlight` colours, progress bars and meters render natively, and buttons keep a visible border.

## Right-to-left

The components use logical properties (`ps-*`, `border-s-*`, `start-*`), so they mirror under `dir="rtl"` on `<html>` or any ancestor. Arrow keys in tabs follow the reading direction.

## Focus

`lg-focus-ring` draws a 3 px solid outline with a 2 px offset in `--lg-focus`, meeting WCAG 2.4.13 Focus Appearance (AAA). Use it on your own interactive elements too.
