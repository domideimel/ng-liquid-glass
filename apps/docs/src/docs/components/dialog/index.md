`lg-dialog` wraps the native `<dialog>` element in modal mode. The browser makes the rest of the page inert, keeps focus inside, closes on Escape and returns focus to the opener.

{{ NgDocActions.demo("DialogDemo") }}

## Usage

- `[(open)]` shows and hides it; closing with Escape updates the model.
- `<h2 lgDialogTitle>` becomes the accessible name.
- `button[lgDialogClose]` closes it.
- `dismissible` also closes it on a backdrop click (`closedby="any"`).
- The browser focuses the first focusable element, so put the least destructive action first.

## Drawer and sheet

`placement="start"` and `placement="end"` slide the dialog in from a side; they follow the reading direction. `placement="bottom"` makes it a sheet. Focus handling and closing behave like the centred dialog.

{{ NgDocActions.demo("DrawerDemo") }}

## Keyboard

| Key               | Action                                  |
| ----------------- | --------------------------------------- |
| Tab / Shift + Tab | Move between controls inside the dialog |
| Escape            | Close                                   |
