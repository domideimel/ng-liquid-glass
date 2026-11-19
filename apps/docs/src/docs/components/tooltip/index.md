`[lgTooltip]` shows supplementary text on hover and keyboard focus. The tooltip is a popover in the top layer, linked with `aria-describedby`. It stays open while hovered and closes with Escape (WCAG 1.4.13).

{{ NgDocActions.demo("TooltipDemo") }}

Tooltips are not visible on touch screens and are announced as descriptions, not names. Never put essential information or interactive content in them, and give icon-only buttons an `aria-label`.
