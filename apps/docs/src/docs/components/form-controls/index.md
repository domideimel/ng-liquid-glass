Native inputs styled and connected to `lg-form-field`. All of them bind to Signal Forms with `[formField]`; see the [Forms guide](guides/forms).

{{ NgDocActions.demo("TextFieldsDemo") }}

Dates, times and numbers use the native inputs (`type="date"`, `time`, `number`): the browser provides an accessible, localised picker and keyboard entry.

## Checkbox, radio, switch and slider

Wrap checkboxes, radios and switches with their text in `<label lgChoice>`, so the whole row is a 44 px target. Group radios in `<fieldset lgFieldset>` with a `<legend>`.

{{ NgDocActions.demo("ChoicesDemo") }}

## Slider with end labels

Labels at both ends ("Straight" … "Swing") go in a row below the slider, with the end the value is closer to highlighted. They are only visual (`aria-hidden`): set `aria-valuetext` to a phrase like "30 % swing" so screen readers announce the same meaning.

{{ NgDocActions.demo("SliderLabelsDemo") }}

## Accessibility

- Labels are real `<label for>` elements; hints and errors are linked with `aria-describedby`.
- Errors appear after the field is touched, prefixed with an icon, and are announced through a polite live region.
- Required fields carry the native `required` attribute (from the schema) and a visual `*` hidden from screen readers.
- `lgSwitch` is a native checkbox with `role="switch"`. Use it for settings that apply immediately, and a checkbox for choices submitted with a form.
