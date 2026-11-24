`lg-number-field` edits a number with − and + buttons, following the WAI-ARIA spinbutton pattern. With `[formField]`, its range comes from the schema's `min()` and `max()` validators; without it, set `min`, `max`, `step` and `largeStep` directly. `valueText` sets what screen readers announce, e.g. "120 BPM".

{{ NgDocActions.demo("NumberFieldDemo") }}

## Keyboard and pointer

| Key                 | Action                          |
| ------------------- | ------------------------------- |
| ↑ / ↓               | Step up / down                  |
| Page Up / Page Down | Step by `largeStep`             |
| Home / End          | Minimum / maximum (when set)    |
| Typing, then Enter  | Apply the typed value (clamped) |

The buttons repeat while held. They stay out of the tab order, as in the WAI-ARIA example: the arrow keys do the same.
