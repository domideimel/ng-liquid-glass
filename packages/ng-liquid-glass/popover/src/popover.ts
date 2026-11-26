import { afterRenderEffect, Component, Directive, ElementRef, inject, input, model, signal } from '@angular/core';
import { lgUniqueId } from '@domideimel/ng-liquid-glass';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A non-modal dialog shown next to its trigger, for small forms, filters or details. It uses the Popover
 * API (top layer, light dismiss, Escape) and CSS anchor positioning. Focus moves into it when it opens and
 * back to the trigger when it closes. Name it with `label` or with `aria-labelledby` on a heading inside.
 *
 * @example
 * <button lgButton [lgPopoverTrigger]="filters">Filters</button>
 * <lg-popover #filters label="Filters">…</lg-popover>
 */
@Component({
  selector: 'lg-popover',
  host: {
    role: 'dialog',
    popover: 'auto',
    tabindex: '-1',
    class:
      'lg-glass m-0 w-max max-w-[min(24rem,calc(100vw-2rem))] rounded-lg-surface p-4 text-lg-fg shadow-xl [inset:auto] [margin-block:0.5rem] [position-area:block-end_span-inline-end] [position-try-fallbacks:flip-block,flip-inline] focus-visible:outline-none',
    '[id]': 'id',
    '[attr.aria-label]': 'label() || null',
    '[style.position-anchor]': 'anchorName()',
    '(beforetoggle)': 'onBeforeToggle($event)',
    '(toggle)': 'onToggle($event)',
  },
  template: '<ng-content />',
})
export class LgPopover {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  /** Accessible name, when there is no heading to point to with `aria-labelledby`. */
  readonly label = input('');

  readonly id = lgUniqueId('lg-popover');
  /** Whether the popover is shown; two-way bindable with `[(open)]`, like `lg-dialog`. */
  readonly open = model(false);
  readonly anchorName = signal<string | null>(null);
  /** The trigger that last opened the popover; set by `lgPopoverTrigger`. */
  trigger: HTMLElement | null = null;
  private hadFocus = false;

  constructor() {
    // Opening through the model (or the trigger) and the browser's own toggling stay in sync.
    afterRenderEffect(() => {
      const open = this.open();
      if (open !== this.element.matches(':popover-open')) this.element.togglePopover(open);
    });
  }

  /** Closes the popover; focus returns to its trigger. Same as setting `open` to false. */
  close(): void {
    this.open.set(false);
  }

  /** Like the browser, only give focus back if it was in the popover (not after a click elsewhere). */
  protected onBeforeToggle(event: Event): void {
    if ((event as ToggleEvent).newState === 'closed') this.hadFocus = this.element.contains(this.element.ownerDocument.activeElement);
  }

  protected onToggle(event: Event): void {
    const open = (event as ToggleEvent).newState === 'open';
    this.open.set(open);
    if (open) {
      const first = this.element.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? this.element).focus();
      return;
    }
    // The browser restores focus to the element focused when the popover opened. Safari doesn't focus a
    // clicked trigger, so that was <body> or a focusable ancestor of the trigger (e.g. a skip-link target),
    // and focus is there or still in the hidden popover: give it to the trigger instead.
    const trigger = this.trigger;
    const active = this.element.ownerDocument.activeElement;
    const lost = active === null || this.element.contains(active) || (trigger !== null && active.contains(trigger));
    if (this.hadFocus && lost && trigger?.isConnected && !trigger.matches(':disabled')) trigger.focus();
  }
}

/**
 * Turns a button into the trigger of an `lg-popover`. It is a native popover invoker
 * (`popoverTargetElement`), so the browser toggles the popover, exposes `aria-expanded` and restores focus.
 */
@Directive({
  selector: 'button[lgPopoverTrigger]',
  host: {
    type: 'button',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'lgPopoverTrigger().open()',
    '[attr.aria-controls]': 'lgPopoverTrigger().id',
    '[style.anchor-name]': 'anchorName',
    '(click)': 'anchor()',
  },
})
export class LgPopoverTrigger {
  /** The popover to toggle. */
  readonly lgPopoverTrigger = input.required<LgPopover>();
  protected readonly anchorName = `--${lgUniqueId('lg-popover-trigger')}`;
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;

  constructor() {
    const element = this.element;
    // Set in the browser only: the server DOM has no popoverTargetElement.
    afterRenderEffect(() => {
      const popover = this.lgPopoverTrigger();
      element.popoverTargetElement = popover.element;
      popover.anchorName.set(this.anchorName);
      popover.trigger = element;
    });
  }

  /** Runs before the browser toggles the popover, so it opens next to this trigger. */
  protected anchor(): void {
    const popover = this.lgPopoverTrigger();
    popover.anchorName.set(this.anchorName);
    popover.trigger = this.element;
  }
}
