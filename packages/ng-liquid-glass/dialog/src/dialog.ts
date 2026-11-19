import { afterRenderEffect, booleanAttribute, Component, Directive, type ElementRef, inject, input, model, viewChild } from '@angular/core';
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
@Component({
  selector: 'lg-dialog',
  template: `
    <dialog
      #dialog
      class="lg-glass m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-auto rounded-lg-surface p-6 text-lg-fg shadow-2xl backdrop:bg-lg-overlay"
      [attr.aria-labelledby]="titleId"
      [attr.closedby]="dismissible() ? 'any' : 'closerequest'"
      (close)="open.set(false)"
    >
      <ng-content />
    </dialog>
  `,
})
export class LgDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /** Whether the dialog is shown. */
  readonly open = model(false);
  /** Also close when the backdrop is clicked (Escape always closes). */
  readonly dismissible = input(false, { transform: booleanAttribute });

  readonly titleId = lgUniqueId('lg-dialog-title');

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
