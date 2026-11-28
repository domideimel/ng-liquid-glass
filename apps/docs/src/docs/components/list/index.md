`ul[lgList]` is a bordered list with dividers for rows of results. Each `li[lgListItem]` has its content on the start side (it takes the free space and wraps) and `[lgListActions]`, a few icon buttons such as copy and delete, on the end side. Name the list when a page has several, and name each action after its row ("Remove password 2").

## Undo in place

`lg-inline-undo` replaces a deleted row with "Password 2 removed" and an Undo button. It has no timeout (WCAG 2.2.3 No Timing) and moves focus to Undo, which screen readers announce together with the message, so focus isn't lost when the row's buttons disappear. Make the deletion final when the user moves on, e.g. on the next deletion, as in the demo. For a deletion with no place to show this, use a [toast](components/toast) with an action.

{{ NgDocActions.demo("ListDemo") }}
