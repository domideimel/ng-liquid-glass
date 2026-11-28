import { afterNextRender, Component, ElementRef, inject, input, output } from '@angular/core';
import { LG_I18N, lgUniqueId } from '@domideimel/ng-liquid-glass';
import { LgButton } from '@domideimel/ng-liquid-glass/button';

/**
 * "Password 2 removed. Undo", shown in place of something that was just deleted. It has no timeout
 * (WCAG 2.2.3 No Timing) and moves focus to its Undo button, which screen readers announce together with
 * the message. Remove it when the user moves on, e.g. on the next deletion or when the list is saved.
 * For a deletion without a place to show this, use a toast with an action instead.
 *
 * @example
 * @for (password of passwords(); track password.id) {
 *   <li lgListItem>
 *     @if (password.removed) {
 *       <lg-inline-undo [message]="password.label + ' removed'" (undo)="restore(password)" />
 *     } @else { … }
 *   </li>
 * }
 */
@Component({
  selector: 'lg-inline-undo',
  imports: [LgButton],
  host: { class: 'flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1' },
  template: `
    <span class="min-w-0 flex-1 text-lg-fg-muted" [id]="messageId">{{ message() }}</span>
    <button lgButton type="button" [attr.aria-describedby]="messageId" (click)="undo.emit()">{{ i18n.undo }}</button>
  `,
})
export class LgInlineUndo {
  protected readonly i18n = inject(LG_I18N);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly messageId = lgUniqueId('lg-undo');

  /** What happened, e.g. "Password 2 removed". */
  readonly message = input.required<string>();
  /** The user wants the deleted item back. */
  readonly undo = output();

  constructor() {
    afterNextRender(() => {
      this.focus();
    });
  }

  /** Moves focus to the Undo button. */
  focus(options?: FocusOptions): void {
    this.host.querySelector('button')?.focus(options);
  }
}
