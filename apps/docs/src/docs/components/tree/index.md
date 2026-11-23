`lg-tree` shows a hierarchy with single selection (WAI-ARIA tree view), e.g. folders or a table of contents. `[(value)]` is the selected node, `[(expanded)]` the open ones. A click on a label selects the node; its arrow, or a double-click, expands or collapses it.

{{ NgDocActions.demo("TreeDemo") }}

## Keyboard

| Key          | Action                                       |
| ------------ | -------------------------------------------- |
| ↓ / ↑        | Next / previous visible node                 |
| →            | Expand the node, or move to its first child  |
| ←            | Collapse the node, or move to its parent     |
| Home / End   | First / last visible node                    |
| Typing       | Jump to the next node starting with the text |
| Enter, Space | Select the node                              |

Left and right are mirrored in right-to-left layouts.
