import { afterRenderEffect, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * The listbox popup of the combobox and select: a manual popover in the top layer, placed below its
 * anchor with CSS anchor positioning and as wide as it. Clicks inside keep focus in the control (except
 * on a classic scrollbar, so it can still be dragged); `contains()` lets the control's blur handler tell
 * focus moving into the popup (an overlay scrollbar drag) from focus leaving.
 *
 * @example
 * <input [style.anchor-name]="anchorName" (blur)="popup.contains($event.relatedTarget) || close()" />
 * <div #popup="lgAnchoredPopup" [lgAnchoredPopup]="open()" [anchor]="anchorName">…</div>
 */
@Directive({
  selector: '[lgAnchoredPopup]',
  exportAs: 'lgAnchoredPopup',
  host: {
    popover: 'manual',
    class:
      'lg-glass m-0 max-h-72 w-[anchor-size(width)] overflow-auto rounded-lg-surface p-1 shadow-xl [inset:auto] [margin-block:0.25rem] [position-area:block-end_span-inline-end] [position-try-fallbacks:flip-block]',
    '[style.position-anchor]': 'anchor()',
    '(mousedown)': 'onMousedown($event)',
  },
})
export class LgAnchoredPopup {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  /** Whether the popup is shown. */
  readonly open = input.required<boolean>({ alias: 'lgAnchoredPopup' });
  /** The anchor's `anchor-name`, e.g. `--my-input`. */
  readonly anchor = input.required<string>();

  constructor() {
    afterRenderEffect(() => {
      const open = this.open();
      if (open !== this.element.matches(':popover-open')) this.element.togglePopover(open);
    });
  }

  /** Whether `target` (e.g. a blur event's `relatedTarget`) is inside the popup. */
  contains(target: EventTarget | null): boolean {
    return target instanceof Node && this.element.contains(target);
  }

  protected onMousedown(event: MouseEvent): void {
    if (event.target !== this.element || event.offsetX < this.element.clientWidth) event.preventDefault();
  }
}
