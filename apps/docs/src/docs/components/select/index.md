`lg-select` picks one option from a list whose options need more than plain text, such as a description line (WAI-ARIA select-only combobox). For plain text options, use the native `<select lgInput>`; for long lists that users search, use the combobox.

{{ NgDocActions.demo("SelectDemo") }}

## Keyboard

| Key                | Action                                         |
| ------------------ | ---------------------------------------------- |
| Enter, Space, ↓, ↑ | Open the list                                  |
| ↓ / ↑, Home / End  | Move through the options                       |
| Typing             | Jump to the next option starting with the text |
| Enter, Space       | Select and close                               |
| Escape, Tab        | Close without changing the selection           |
