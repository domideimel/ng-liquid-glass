`lg-file-input` is built on the native `<input type="file">`, so the browser's file picker, keyboard handling and screen reader support stay intact. Files can also be dropped onto it; `accept` applies to dropped files too. Selected files are listed with remove buttons, and changes are announced.

{{ NgDocActions.demo("FileInputDemo") }}

To require a file, use `minLength(path, 1)`: Signal Forms' `required` treats an empty list as a value.
