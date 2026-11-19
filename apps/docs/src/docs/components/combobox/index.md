`lg-combobox` lets people type to filter a list and pick one option. It follows the WAI-ARIA combobox pattern with list autocomplete and `aria-activedescendant`. Use it instead of `<datalist>`, whose screen-reader support is inconsistent.

{{ NgDocActions.demo("ComboboxDemo") }}

## Server-side search

Set `[filter]="null"` to turn off local filtering, load suggestions from `(query)`, and show `loading` while waiting.

{{ NgDocActions.demo("ComboboxSearchDemo") }}

## API

| Input / output                        | Description                                                 |
| ------------------------------------- | ----------------------------------------------------------- |
| `value` (model)                       | The selected option; bind with `[formField]` or `[(value)]` |
| `options`                             | The options, or your search results                         |
| `displayWith`                         | Maps an option to its text (default `String`)               |
| `filter`                              | `(text, query) => boolean`, `null` to filter yourself       |
| `loading`, `placeholder`, `ariaLabel` | Loading state, placeholder, name of the list                |
| `(query)`                             | The text the user typed                                     |

Free text is not kept: on blur the input shows the selected option again, or clears.

## Keyboard

| Key     | Action                                        |
| ------- | --------------------------------------------- |
| ↓ / ↑   | Open the list, move the active option (wraps) |
| Alt + ↓ | Open without moving                           |
| Enter   | Select the active option                      |
| Escape  | Close; press again to clear                   |
| Tab     | Close and move on                             |

The number of results is announced through a polite live region.
