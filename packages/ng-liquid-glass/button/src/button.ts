import { afterNextRender, booleanAttribute, computed, Directive, ElementRef, inject, input, isDevMode } from '@angular/core';

export type LgButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type LgButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type LgButtonShape = 'default' | 'circle';

// Each map sets the button's only radius class, so rounded-lg-control can't override a circle's rounded-full.
// sm and md padding follow the density (px-lg-control-px*). sm is drawn at 32 px (24 px compact);
// lg-hit-area keeps its pointer target at --lg-target-size.
const SIZES: Record<LgButtonSize, string> = {
  sm: 'min-h-lg-control-sm min-w-lg-control-sm rounded-lg-control px-lg-control-px-sm text-sm lg-hit-area',
  md: 'min-h-lg-control min-w-lg-control rounded-lg-control px-lg-control-px text-base',
  lg: 'min-h-14 min-w-14 rounded-lg-control px-6 text-lg',
  xl: 'min-h-20 min-w-20 rounded-lg-control px-8 text-xl',
};
// Round, icon-only buttons: square, no padding; xl (96 px) suits a main action like a play button.
const CIRCLES: Record<LgButtonSize, string> = {
  sm: 'size-lg-control-sm rounded-full px-0 text-sm lg-hit-area',
  md: 'size-lg-control rounded-full px-0 text-base',
  lg: 'size-14 rounded-full px-0 text-lg',
  xl: 'size-24 rounded-full px-0 text-xl',
};

const VARIANTS: Record<LgButtonVariant, string> = {
  primary: 'border border-transparent bg-lg-primary text-lg-on-primary hover:bg-lg-primary-hover',
  accent: 'border border-transparent bg-lg-accent text-lg-on-accent hover:bg-lg-accent-hover',
  secondary: 'bg-lg-surface text-lg-fg border border-lg-control-border hover:bg-lg-surface-muted',
  ghost: 'border border-transparent bg-transparent text-lg-fg hover:bg-lg-surface-muted',
  danger: 'border border-transparent bg-lg-danger text-lg-on-danger hover:opacity-90',
};

/**
 * Styles a native `<button>` or `<a>` as a button. Pointer targets are at least 44 × 44 px
 * (WCAG 2.5.5 Target Size, AAA), also for `size="sm"`, which is drawn smaller.
 *
 * @example
 * <button lgButton variant="primary" type="submit">Save</button>
 * <button lgButton shape="circle" aria-label="Close"><svg aria-hidden="true">…</svg></button>
 */
@Directive({
  selector: 'button[lgButton], a[lgButton]',
  host: {
    class:
      'lg-focus-ring inline-flex font-[inherit] no-underline cursor-pointer items-center justify-center gap-2 font-medium transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-60 disabled:cursor-not-allowed disabled:opacity-60',
    '[class]': 'variantClass() + " " + sizeClass()',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.aria-disabled]': 'loading() || null',
  },
})
export class LgButton {
  /** Visual emphasis. Use one `primary` button per view. */
  readonly variant = input<LgButtonVariant>('secondary');
  /** Shows a busy state; the button stays focusable but ignores activation. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** `sm` is drawn smaller but keeps a 44 px target; `xl` suits a main action. */
  readonly size = input<LgButtonSize>('md');
  /** `circle`: a round, icon-only button. Give it an `aria-label`. */
  readonly shape = input<LgButtonShape>('default');

  protected readonly variantClass = computed(() => VARIANTS[this.variant()]);
  protected readonly sizeClass = computed(() => (this.shape() === 'circle' ? CIRCLES : SIZES)[this.size()]);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    if (isDevMode()) {
      afterNextRender(() => {
        // Empty strings count as missing, so check each source for real text.
        const named = [element.getAttribute('aria-label'), element.getAttribute('aria-labelledby'), element.textContent].some(
          (text) => !!text?.trim(),
        );
        if (this.shape() === 'circle' && !named) {
          // eslint-disable-next-line no-console -- development-only accessibility warning
          console.warn('lgButton: an icon-only (circle) button needs an accessible name; add aria-label.', element);
        }
      });
    }
    // Capture phase so the guard runs before any (click) listener the consumer adds.
    element.addEventListener(
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
