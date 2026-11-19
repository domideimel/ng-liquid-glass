`lgButton` styles a native `<button>` or `<a>`. Use buttons for actions and links for navigation.

{{ NgDocActions.demo("ButtonDemo") }}

## Usage

```html
<button lgButton variant="primary" type="submit">Save</button> <a lgButton href="/docs">Read the docs</a>
```

- `variant`: `primary` (one per view), `secondary` (default), `ghost`, `danger`.
- `loading`: sets `aria-busy` and `aria-disabled`; the button keeps focus but ignores clicks.

## Accessibility

- Targets are at least 44 × 44 px (2.5.5 AAA).
- Icon-only buttons need an `aria-label`.
- Prefer `loading` over `disabled` during async work, so focus is not lost.
