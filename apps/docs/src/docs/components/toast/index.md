`LgToaster` shows notifications in an `<lg-toaster>` live region; add the region once to your root template. Errors go into a `role="alert"` region and are announced right away; everything else is polite.

{{ NgDocActions.demo("ToastDemo") }}

## Usage

```typescript
private readonly toaster = inject(LgToaster);

this.toaster.show({ message: 'Project archived', status: 'success', action: { label: 'Undo', run: () => this.restore() } });
```

By default a toast stays until it is dismissed (WCAG 2.2.3 No Timing, AAA). If you set a `duration`, the timer pauses while any toast is hovered or focused. Do not put the only way to do something in a toast.
