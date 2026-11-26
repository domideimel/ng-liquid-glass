`lg-dialog` wraps the native `<dialog>` element in modal mode. The browser makes the rest of the page inert, keeps focus inside, closes on Escape and returns focus to the opener, also in Safari, where clicking a button doesn't focus it. When the opener is gone by the time the dialog closes (a menu item, a row that was deleted), name another element with `[returnFocus]`.

{{ NgDocActions.demo("DialogDemo") }}

## Usage

- `[(open)]` shows and hides it; closing with Escape updates the model.
- `<h2 lgDialogTitle>` becomes the accessible name.
- `button[lgDialogClose]` closes it.
- `dismissible` also closes it on a backdrop click.
- `(closed)` emits however it closes (Escape, a close button, the backdrop, `open` set to false).
- The browser focuses the first focusable element, so put the least destructive action first.

## Alert dialog

For an urgent question the user must answer, add `alert`: the dialog gets `role="alertdialog"`, never closes on a backdrop click, and `<p lgDialogDescription>` becomes its description. Put the least destructive action first; the browser focuses it.

{{ NgDocActions.demo("AlertDialogDemo") }}

## Drawer and sheet

`placement="start"` and `placement="end"` slide the dialog in from a side; they follow the reading direction. `placement="bottom"` makes it a sheet. Focus handling and closing behave like the centred dialog.

{{ NgDocActions.demo("DrawerDemo") }}

## Responsive sheet

`placement="sheet"` is a bottom sheet on small screens and a centred dialog from the `sm` breakpoint up (CSS only). Bottom sheets keep their content clear of the home indicator of installed apps (`env(safe-area-inset-bottom)`; add `viewport-fit=cover` to your viewport meta tag).

To open a dialog when it renders and remove it when dismissed, render it with `@if`, set `[open]="true"` and react to `(closed)`. No two-way binding is needed.

The header in this demo is a recipe: the title with `me-auto`, an optional accessory, and a round close button with an `aria-label`. The dialog itself scrolls when the content is long.

{{ NgDocActions.demo("SheetDemo") }}

## Keyboard

| Key               | Action                                  |
| ----------------- | --------------------------------------- |
| Tab / Shift + Tab | Move between controls inside the dialog |
| Escape            | Close                                   |
