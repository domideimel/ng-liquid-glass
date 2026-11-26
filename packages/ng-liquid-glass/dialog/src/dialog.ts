import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  Directive,
  type ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { lgUniqueId } from '@domideimel/ng-liquid-glass';

/**
 * A modal dialog built on the native `<dialog>` element: the browser traps focus, makes the page
 * inert, closes on Escape and restores focus to the opener: the focused element when it opened or, where a
 * click doesn't focus (Safari), the element that was clicked to open it, or `returnFocus`.
 *
 * @example
 * <lg-dialog [(open)]="open">
 *   <h2 lgDialogTitle>Delete project?</h2>
 *   <button lgButton lgDialogClose>Cancel</button>
 * </lg-dialog>
 */
export type LgDialogPlacement = 'center' | 'start' | 'end' | 'bottom' | 'sheet';

/** Bottom padding that clears the home indicator of installed PWAs (needs `viewport-fit=cover`). */
const SAFE_BOTTOM = 'pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))]';

/** What a click can open the dialog from: the nearest focusable ancestor of its target. */
const FOCUSABLE = 'button, a[href], input, select, textarea, summary, [tabindex]';
/** A click this recent (ms) counts as the one that opened the dialog. */
const OPENER_CLICK_WINDOW = 1000;

const PLACEMENTS: Record<LgDialogPlacement, string> = {
  center: 'm-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] rounded-lg-surface',
  start: 'my-0 ms-0 me-auto h-dvh max-h-dvh w-[min(24rem,calc(100vw-3rem))] rounded-e-lg-surface',
  end: 'my-0 me-0 ms-auto h-dvh max-h-dvh w-[min(24rem,calc(100vw-3rem))] rounded-s-lg-surface',
  bottom: `mx-auto mt-auto mb-0 max-h-[85dvh] w-full max-w-3xl rounded-t-lg-surface ${SAFE_BOTTOM}`,
  // A bottom sheet on small screens, a centred dialog from the sm breakpoint up. CSS only.
  // max-w-none: the browser's default dialog styles would keep it 2em narrower than the screen.
  sheet: `mx-auto mt-auto mb-0 max-h-[85dvh] w-full max-w-none rounded-t-lg-surface ${SAFE_BOTTOM} sm:m-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[min(32rem,calc(100vw-2rem))] sm:rounded-lg-surface sm:pb-6`,
};

@Component({
  selector: 'lg-dialog',
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -- backdrop clicks only; Escape closes natively -->
    <dialog
      #dialog
      class="lg-glass overflow-auto p-6 text-lg-fg shadow-2xl backdrop:bg-lg-overlay"
      [class]="placementClass()"
      [attr.role]="alert() ? 'alertdialog' : null"
      [attr.aria-labelledby]="titleId"
      [attr.aria-describedby]="descriptions() > 0 ? descriptionId : null"
      [attr.closedby]="lightDismiss() ? 'any' : 'closerequest'"
      (close)="onClose()"
      (click)="onClick($event)"
    >
      <ng-content />
    </dialog>
  `,
})
export class LgDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /** Whether the dialog is shown. */
  readonly open = model(false);
  /**
   * `center` (default) is a modal dialog; `start` and `end` are drawers along the side (they follow the
   * reading direction), `bottom` is a sheet.
   */
  readonly placement = input<LgDialogPlacement>('center');
  /** Also close when the backdrop is clicked (Escape always closes). Ignored for alert dialogs. */
  readonly dismissible = input(false, { transform: booleanAttribute });
  /**
   * An alert dialog (`role="alertdialog"`) for an urgent question the user must answer, e.g. "Delete
   * setlist?" (WAI-ARIA alert dialog pattern). It never closes on a backdrop click; describe the question
   * with `lgDialogDescription`. Put the least destructive action first, as the browser focuses it.
   */
  readonly alert = input(false, { transform: booleanAttribute });
  /**
   * Emits whenever the dialog closes: Escape, a close button, a backdrop click or `open` set to false.
   * With `@if (show) { <lg-dialog [open]="true" (closed)="show = false"> }` a dialog opens on render
   * and removes itself when dismissed, without a two-way binding.
   */
  readonly closed = output();
  /**
   * The element that gets focus back when the dialog closes, e.g. when it was opened from a menu item that
   * is gone by then. By default it's the opener (see above).
   */
  readonly returnFocus = input<HTMLElement | null>(null);

  readonly titleId = lgUniqueId('lg-dialog-title');
  readonly descriptionId = lgUniqueId('lg-dialog-description');
  /** Number of `lgDialogDescription` elements; set by them. */
  readonly descriptions = signal(0);
  protected readonly placementClass = computed(() => PLACEMENTS[this.placement()]);
  protected readonly lightDismiss = computed(() => this.dismissible() && !this.alert());

  private readonly document = inject(DOCUMENT);
  private opener: HTMLElement | null = null;
  /** What the browser will restore focus to: the element focused at showModal(). */
  private focusedAtOpen: Element | null = null;
  private lastClick: { target: HTMLElement; time: number } | null = null;

  /**
   * Light dismiss for `dismissible`, also where `closedby="any"` isn't supported: a click on the
   * backdrop targets the dialog element itself, outside its box.
   */
  protected onClick(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (!this.lightDismiss() || event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) this.open.set(false);
  }

  protected onClose(): void {
    this.open.set(false);
    this.restoreFocus();
    this.closed.emit();
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // Safari doesn't focus a clicked button, so the browser would have nothing to restore: remember clicks.
      const remember = (event: MouseEvent): void => {
        const target = (event.target as Element).closest<HTMLElement>(FOCUSABLE);
        this.lastClick = target ? { target, time: event.timeStamp } : null;
      };
      this.document.addEventListener('click', remember, { capture: true });
      destroyRef.onDestroy(() => {
        this.document.removeEventListener('click', remember, { capture: true });
      });
    });
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) {
        this.focusedAtOpen = this.document.activeElement;
        this.opener = this.findOpener();
        dialog.showModal();
      }
      if (!this.open() && dialog.open) dialog.close();
    });
  }

  /**
   * The focused element, unless a click just now hit something inside it that didn't take focus: Safari
   * doesn't focus a clicked button, so focus stays on <body> or moves to a focusable ancestor (e.g. a
   * skip-link target with tabindex="-1").
   */
  private findOpener(): HTMLElement | null {
    const active = this.document.activeElement;
    const click = this.lastClick;
    const clicked = click !== null && performance.now() - click.time < OPENER_CLICK_WINDOW ? click.target : null;
    if (clicked && clicked !== active && (active === null || active.contains(clicked))) return clicked;
    return active instanceof HTMLElement && active !== this.document.body ? active : null;
  }

  /**
   * The browser restores focus to the element focused at showModal(); when that wasn't the opener (a click
   * in Safari) or `returnFocus` names another element, move focus there. No `focusVisible` option: the
   * browser shows the ring after Escape and hides it after a click.
   */
  private restoreFocus(): void {
    const target = this.returnFocus() ?? this.opener;
    const focusedAtOpen = this.focusedAtOpen;
    this.opener = this.focusedAtOpen = null;
    const active = this.document.activeElement;
    // Focus is where the browser put it (the element focused at showModal(), <body>), or WebKit left it in
    // the closed dialog; anything else means the app moved it on purpose.
    const lost =
      active === null || active === this.document.body || active === focusedAtOpen || this.dialog().nativeElement.contains(active);
    if (target?.isConnected && !target.matches(':disabled') && (lost || this.returnFocus() !== null)) target.focus();
  }
}

/** The dialog's heading; it becomes the dialog's accessible name. */
@Directive({
  selector: '[lgDialogTitle]',
  host: { class: 'mt-0 mb-4 text-xl font-semibold', '[id]': 'dialog.titleId' },
})
export class LgDialogTitle {
  protected readonly dialog = inject(LgDialog);
}

/** The dialog's message; it becomes the dialog's description (`aria-describedby`), e.g. for alert dialogs. */
@Directive({
  selector: '[lgDialogDescription]',
  host: { class: 'mt-0 mb-6 text-lg-fg-muted', '[id]': 'dialog.descriptionId' },
})
export class LgDialogDescription {
  protected readonly dialog = inject(LgDialog);

  constructor() {
    this.dialog.descriptions.update((count) => count + 1);
    inject(DestroyRef).onDestroy(() => {
      this.dialog.descriptions.update((count) => count - 1);
    });
  }
}

/** Closes the surrounding dialog when activated. */
@Directive({
  selector: 'button[lgDialogClose]',
  host: { type: 'button', '(click)': 'dialog.open.set(false)' },
})
export class LgDialogClose {
  protected readonly dialog = inject(LgDialog);
}
