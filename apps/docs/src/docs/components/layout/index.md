A 12-column CSS grid with **container queries**. Its breakpoints refer to the width of the grid itself, not the viewport, so the same layout works in a full page, a sidebar or a dialog.

| Breakpoint | Grid width |
| ---------- | ---------- |
| `base`     | any        |
| `sm`       | ≥ 30rem    |
| `md`       | ≥ 48rem    |
| `lg`       | ≥ 64rem    |
| `xl`       | ≥ 80rem    |

{{ NgDocActions.demo("GridDemo") }}

## Auto-fill

For lists of equal items, set `minItemWidth`. The grid fits as many columns as there is room for, with no breakpoints.

{{ NgDocActions.demo("AutoGridDemo") }}

## Subgrid

`[rows]` lets a cell span rows of the parent grid and share them (`grid-template-rows: subgrid`). The title, text and footer of cards in a row then line up, whatever their length.

{{ NgDocActions.demo("SubgridDemo") }}

## Helpers

- `[lgContainer]`: centred page width with side padding (`size`: `sm` … `xl`, `full`).
- `[lgStack]`: vertical rhythm.
- `[lgCluster]`: a wrapping row for buttons or tags.

All take `gap`: `none`, `sm`, `md`, `lg`, `xl`. Responsive values are typed: `[span]="{ base: 12, md: 6, lg: 4 }"`.
