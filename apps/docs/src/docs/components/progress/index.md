Native `<progress>` for task progress (omit `value` for an indeterminate state), native `<meter>` for a value within a known range, and `lg-spinner` for short waits. Give each a label.

{{ NgDocActions.demo("ProgressDemo") }}

The spinner is a `role="status"` region with a visually hidden text ("Loading" by default). Its animation stops under `prefers-reduced-motion`.
