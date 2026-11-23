A non-modal dialog next to its trigger, built on the Popover API: it closes on Escape or a click outside, focus moves into it and back to the trigger. Use it for small forms, filters and details; use `lg-dialog` when the user must respond before continuing.

{{ NgDocActions.demo("PopoverDemo") }}

`[(open)]` reads and sets the state, like `lg-dialog`; `close()` is a shortcut for closing from inside, e.g. an Apply button.
