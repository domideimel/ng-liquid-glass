`lg-file-input` is built on the native `<input type="file">`, so the browser's file picker, keyboard handling and screen reader support stay intact. Files can also be dropped onto it; `accept` applies to dropped files too. Selected files are listed with remove buttons, and changes are announced.

{{ NgDocActions.demo("FileInputDemo") }}

To require a file, use `minLength(path, 1)`: Signal Forms' `required` treats an empty list as a value.

## Drop zone

`[lgFileDrop]` makes any area a drop target, e.g. the card around a text area that a file fills. While files are dragged over it, it shows a dashed outline and gets `data-dragging`. It emits the dropped files that match `lgFileDropAccept` through `(lgFileDrop)` and the others through `(lgFileDropRejected)`; `lgFileDropSingle` keeps only the first. Dropping only works with a pointer, so keep a file input next to it as the keyboard route. `lgAcceptsFile(file, accept)` applies the same `accept` rules in your own code.

{{ NgDocActions.demo("FileDropDemo") }}
