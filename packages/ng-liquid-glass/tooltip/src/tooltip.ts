import { afterNextRender, DestroyRef, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { lgUniqueId } from '@domideimel/ng-liquid-glass';

const HIDE_DELAY_MS = 150;

/**
 * A short description shown on hover and keyboard focus (WAI-ARIA tooltip pattern).
 * It stays open while hovered, and Escape hides it (WCAG 1.4.13 Content on Hover or Focus).
 * Use it for supplementary text only; icon-only buttons still need an `aria-label`.
 *
 * @example
 * <button lgButton aria-label="Copy" lgTooltip="Copy to clipboard">…</button>
 */
@Directive({
  selector: '[lgTooltip]',
  host: {
    '[attr.aria-describedby]': 'id',
    '[style.anchor-name]': 'anchorName',
    '(pointerenter)': 'show()',
    '(pointerleave)': 'scheduleHide()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
  },
})
export class LgTooltip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  /** The tooltip text. */
  readonly lgTooltip = input.required<string>();

  readonly id = lgUniqueId('lg-tooltip');
  protected readonly anchorName = `--${this.id}`;
  private tip: HTMLElement | undefined;
  private hideTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.hide();
  };

  constructor() {
    afterNextRender(() => {
      const doc = this.host.ownerDocument;
      const tip = doc.createElement('div');
      tip.id = this.id;
      tip.role = 'tooltip';
      tip.popover = 'manual';
      tip.className =
        'lg-glass m-0 max-w-xs rounded-lg-control px-3 py-1.5 text-sm text-lg-fg shadow-lg [inset:auto] [position-area:block-start] [position-try-fallbacks:flip-block] [margin-block:0.5rem]';
      tip.style.setProperty('position-anchor', this.anchorName);
      tip.addEventListener('pointerenter', () => {
        clearTimeout(this.hideTimer);
      });
      tip.addEventListener('pointerleave', () => {
        this.scheduleHide();
      });
      doc.body.append(tip);
      this.tip = tip;
      tip.textContent = this.lgTooltip();
    });
    effect(() => {
      const text = this.lgTooltip();
      if (this.tip) this.tip.textContent = text;
    });
    inject(DestroyRef).onDestroy(() => {
      this.hide();
      this.tip?.remove();
    });
  }

  show(): void {
    clearTimeout(this.hideTimer);
    if (!this.tip || this.tip.matches(':popover-open')) return;
    this.tip.showPopover();
    this.host.ownerDocument.addEventListener('keydown', this.onKeydown);
  }

  hide(): void {
    clearTimeout(this.hideTimer);
    this.host.ownerDocument.removeEventListener('keydown', this.onKeydown);
    if (this.tip?.matches(':popover-open')) this.tip.hidePopover();
  }

  protected scheduleHide(): void {
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      this.hide();
    }, HIDE_DELAY_MS);
  }
}
