Styles a native `<a>` as a text link. Links with `target="_blank"` get an icon and tell screen readers that they open a new tab (WCAG 3.2.5). Links inside a sentence are exempt from the 44 px target size (WCAG 2.5.5); use `lgButton` for standalone actions.

{{ NgDocActions.demo("LinkDemo") }}

## Long URLs

`lg-url-text` shows a URL that wraps after `/`, `?`, `&`, `=` and `#` instead of in the middle of a word. Use it inside a link or a result box; copying and screen readers get the plain URL.

{{ NgDocActions.demo("UrlTextDemo") }}
