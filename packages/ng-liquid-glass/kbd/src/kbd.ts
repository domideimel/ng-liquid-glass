import { Directive } from '@angular/core';

/**
 * Styles a native `<kbd>` as a key. Nest them for key combinations.
 *
 * @example
 * <kbd lgKbd><kbd lgKbd>Ctrl</kbd> + <kbd lgKbd>K</kbd></kbd>
 */
@Directive({
  selector: 'kbd[lgKbd]',
  host: {
    class:
      'inline-flex min-w-6 items-center justify-center rounded-md border border-lg-control-border bg-lg-surface-muted px-1.5 font-mono text-[0.875em] text-lg-fg shadow-[inset_0_-2px_0_var(--lg-border)] [&_kbd]:shadow-none [&:has(kbd)]:border-0 [&:has(kbd)]:bg-transparent [&:has(kbd)]:gap-1 [&:has(kbd)]:px-0 [&:has(kbd)]:shadow-none',
  },
})
export class LgKbd {}
