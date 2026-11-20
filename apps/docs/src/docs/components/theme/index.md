`lg-theme-switcher` lets users choose light, dark or system colours. The choice sets `data-theme` on `<html>` and is remembered in `localStorage`. Use the `LgTheme` service to read or change the mode yourself; it is safe with server-side rendering.

{{ NgDocActions.demo("ThemeDemo") }}

To avoid a flash of the wrong theme on load, apply the stored choice before Angular starts, in `index.html`:

```html
<script>
  const theme = localStorage.getItem('lg-theme');
  if (theme) document.documentElement.dataset.theme = theme;
</script>
```
