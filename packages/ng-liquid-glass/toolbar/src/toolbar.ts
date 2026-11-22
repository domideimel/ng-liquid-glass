import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

const ITEMS = 'button:not([disabled]), a[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), [lgToolbarItem]';

/**
 * A toolbar (WAI-ARIA toolbar pattern): one Tab stop for the whole group, arrow keys move between its
 * buttons, links and inputs (following the reading direction), Home and End jump to the ends. Name it
 * with `aria-label`. Mark custom focusable elements with `lgToolbarItem`.
 *
 * @example
 * <div lgToolbar aria-label="Formatting">
 *   <button lgToggle [(pressed)]="bold">Bold</button>
 *   <button lgToggle [(pressed)]="italic">Italic</button>
 * </div>
 */
@Directive({
  selector: '[lgToolbar]',
  host: {
    role: 'toolbar',
    class: 'flex flex-wrap items-center gap-1 rounded-lg-surface border border-lg-border bg-lg-surface p-1',
    '[class.flex-col]': "orientation() === 'vertical'",
    '[class.items-stretch]': "orientation() === 'vertical'",
    '[attr.aria-orientation]': 'orientation()',
    '(keydown)': 'onKeydown($event)',
    '(focusin)': 'onFocusin($event)',
  },
})
export class LgToolbar {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  private current: HTMLElement | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.syncTabStops();
      // Re-sync when items are added, removed, enabled or disabled; tabindex changes are ours and not observed.
      const observer = new MutationObserver(() => {
        this.syncTabStops();
      });
      observer.observe(this.element, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'href', 'type'] });
      destroyRef.onDestroy(() => {
        observer.disconnect();
      });
    });
  }

  private items(): HTMLElement[] {
    return [...this.element.querySelectorAll<HTMLElement>(ITEMS)];
  }

  /** Exactly one item is in the tab order: the last focused one, else the first. */
  private syncTabStops(): void {
    const items = this.items();
    if (!this.current || !items.includes(this.current)) this.current = items[0] ?? null;
    for (const item of items) item.tabIndex = item === this.current ? 0 : -1;
  }

  protected onFocusin(event: FocusEvent): void {
    const item = this.items().find((candidate) => candidate === event.target);
    if (item) {
      this.current = item;
      this.syncTabStops();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const items = this.items();
    const index = items.indexOf(event.target as HTMLElement);
    if (index < 0) return;
    // Text inputs keep their own arrow keys.
    if (event.target instanceof HTMLInputElement && event.target.type !== 'checkbox' && event.target.type !== 'radio') return;
    const vertical = this.orientation() === 'vertical';
    const rtl = getComputedStyle(this.element).direction === 'rtl';
    const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    const next = {
      [forward]: (index + 1) % items.length,
      [backward]: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key];
    const item = next === undefined ? undefined : items[next];
    if (!item) return;
    event.preventDefault();
    item.focus();
  }
}

/** Marks a custom focusable element as a toolbar item. */
@Directive({ selector: '[lgToolbarItem]' })
export class LgToolbarItem {}
