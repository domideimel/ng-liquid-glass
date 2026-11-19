The form controls support **Signal Forms** (`@angular/forms/signals`), Angular's current forms API. Reactive and template-driven forms are not supported.

- **Native controls** (`lgInput`, `lgCheckbox`, `lgRadio`, `lgSwitch`, `lgSlider`) are plain HTML elements, so `[formField]` binds them directly.
- **The typeahead** (`lg-combobox`) implements `FormValueControl`.
- **`lg-form-field`** reads the field state through `FORM_FIELD`. It marks the control `aria-invalid` once it is touched and invalid, shows the validators' `message`s, and links label, hint and errors.

Signal Forms owns attributes such as `required`, `min`, `max` and `name`. Declare them in the schema rather than in the template.

{{ NgDocActions.demo("SignUpFormDemo", { expanded: false }) }}
