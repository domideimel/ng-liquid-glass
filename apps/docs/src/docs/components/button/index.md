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

## Sizes and round buttons

`size` is `sm`, `md` (default), `lg` or `xl`. `sm` is drawn 32 px tall but keeps a 44 px pointer target with an invisible hit area (`lg-hit-area`), so it still meets WCAG 2.5.5 AAA. `shape="circle"` makes a round, icon-only button; give it an `aria-label` (in development, a missing name logs a warning).

{{ NgDocActions.demo("ButtonSizesDemo") }}

## Badge on a button

Pin an `lgBadge` to a corner with `relative` on the button and `absolute -top-1 -end-1` on the badge. Screen readers don't connect a badge to its button, so put the count into the button's name (`aria-label="Setlist, 3 songs"`) and hide the badge (`aria-hidden="true"`).

{{ NgDocActions.demo("ButtonBadgeDemo") }}
