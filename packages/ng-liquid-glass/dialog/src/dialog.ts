import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  Directive,
  type ElementRef,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { lgUniqueId } from '@domideimel/ng-liquid-glass';

/**
 * A modal dialog built on the native `<dialog>` element: the browser traps focus, makes the page
 * inert, closes on Escape and restores focus to the opener.
 *
 * @example
 * <lg-dialog [(open)]="open">
 *   <h2 lgDialogTitle>Delete project?</h2>
 *   <button lgButton lgDialogClose>Cancel</button>
 * </lg-dialog>
 */
export type LgDialogPlacement = 'center' | 'start' | 'end' | 'bottom';

const PLACEMENTS: Record<LgDialogPlacement, string> = {
  center: 'm-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] rounded-lg-surface',
  start: 'my-0 ms-0 me-auto h-dvh max-h-dvh w-[min(24rem,calc(100vw-3rem))] rounded-e-lg-surface',
  end: 'my-0 me-0 ms-auto h-dvh max-h-dvh w-[min(24rem,calc(100vw-3rem))] rounded-s-lg-surface',
  bottom: 'mx-auto mt-auto mb-0 max-h-[85dvh] w-full max-w-3xl rounded-t-lg-surface',
};

@Component({
  selector: 'lg-dialog',
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -- backdrop clicks only; Escape closes natively -->
    <dialog
      #dialog
      class="lg-glass overflow-auto p-6 text-lg-fg shadow-2xl backdrop:bg-lg-overlay"
      [class]="placementClass()"
      [attr.aria-labelledby]="titleId"
      [attr.closedby]="dismissible() ? 'any' : 'closerequest'"
      (close)="open.set(false)"
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
  /** Also close when the backdrop is clicked (Escape always closes). */
  readonly dismissible = input(false, { transform: booleanAttribute });

  readonly titleId = lgUniqueId('lg-dialog-title');
  protected readonly placementClass = computed(() => PLACEMENTS[this.placement()]);

  /**
   * Light dismiss for `dismissible`, also where `closedby="any"` isn't supported: a click on the
   * backdrop targets the dialog element itself, outside its box.
   */
  protected onClick(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (!this.dismissible() || event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) this.open.set(false);
  }

  constructor() {
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) dialog.showModal();
      if (!this.open() && dialog.open) dialog.close();
    });
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

/** Closes the surrounding dialog when activated. */
@Directive({
  selector: 'button[lgDialogClose]',
  host: { type: 'button', '(click)': 'dialog.open.set(false)' },
})
export class LgDialogClose {
  protected readonly dialog = inject(LgDialog);
}
