`lg-copy-button` copies `value` to the clipboard. It confirms with a check mark for two seconds and announces "Copied" through a live region, so its name stays the same. Where the Clipboard API is missing or refuses (pages served over plain HTTP, a denied permission), it shows and announces a message asking the user to select and copy the text themselves.

By default it is a round icon button named by `label` ("Copy hash"); add `showLabel` to show the label next to the icon. Listen to `(copied)` or `(copyFailed)` to add a toast, as the second button does.

{{ NgDocActions.demo("CopyButtonDemo") }}
