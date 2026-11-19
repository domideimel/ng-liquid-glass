import { booleanAttribute, computed, Directive, ElementRef, inject, input } from '@angular/core';

export type LgButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANTS: Record<LgButtonVariant, string> = {
  primary: 'border border-transparent bg-lg-primary text-lg-on-primary hover:bg-lg-primary-hover',
  secondary: 'bg-lg-surface text-lg-fg border border-lg-control-border hover:bg-lg-surface-muted',
  ghost: 'border border-transparent bg-transparent text-lg-fg hover:bg-lg-surface-muted',
  danger: 'border border-transparent bg-lg-danger text-lg-on-danger hover:opacity-90',
};

/**
 * Styles a native `<button>` or `<a>` as a button. Targets are at least 44 × 44 px
 * (WCAG 2.5.5 Target Size, AAA).
 *
 * @example
 * <button lgButton variant="primary" type="submit">Save</button>
 */
@Directive({
  selector: 'button[lgButton], a[lgButton]',
  host: {
    class:
      'lg-focus-ring inline-flex min-h-11 font-[inherit] text-base no-underline min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg-control px-4 font-medium transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-60 disabled:cursor-not-allowed disabled:opacity-60',
    '[class]': 'variantClass()',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.aria-disabled]': 'loading() || null',
  },
})
export class LgButton {
  /** Visual emphasis. Use one `primary` button per view. */
  readonly variant = input<LgButtonVariant>('secondary');
  /** Shows a busy state; the button stays focusable but ignores activation. */
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly variantClass = computed(() => VARIANTS[this.variant()]);

  constructor() {
    // Capture phase so the guard runs before any (click) listener the consumer adds.
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.addEventListener(
      'click',
      (event) => {
        if (this.loading()) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
  }
}
