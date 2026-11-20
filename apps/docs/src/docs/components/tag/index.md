`lg-tag` labels a keyword or selection. With `removable`, it gets a 44 px remove button named "Remove <text>".

{{ NgDocActions.demo("TagDemo") }}

## Tag input

`lg-tag-input` collects a list of tags: Enter or comma adds the typed text, Backspace in the empty input removes the last tag, and changes are announced. It works with `[formField]` and `lg-form-field`. To require at least one tag, use `minLength(path, 1)`: Signal Forms' `required` treats an empty array as a value.

{{ NgDocActions.demo("TagInputDemo") }}
