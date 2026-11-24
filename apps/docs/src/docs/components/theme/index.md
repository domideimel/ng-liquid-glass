`lg-theme-switcher` lets users choose light, dark or system colours. The choice sets `data-theme` on `<html>` and is remembered in `localStorage`. Use the `LgTheme` service to read or change the mode yourself; it is safe with server-side rendering.

{{ NgDocActions.demo("ThemeDemo") }}

For installed PWAs, let `LgTheme` keep `<meta name="theme-color">` equal to the page background, so the status bar follows the theme (and the operating system in `system` mode):

```typescript
bootstrapApplication(App, { providers: [provideLgTheme({ syncThemeColor: true })] });
```

To avoid a flash of the wrong theme on load, apply the stored choice before Angular starts, in `index.html`:

```html
<script>
  const theme = localStorage.getItem('lg-theme');
  if (theme) document.documentElement.dataset.theme = theme;
</script>
```
