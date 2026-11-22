import { booleanAttribute, Component, inject, input, output } from '@angular/core';
import { LG_I18N, lgUniqueId } from '@domideimel/ng-liquid-glass';

/**
 * A compact label for a keyword, filter or selection. With `removable`, it gets a remove button
 * (44 × 44 px target) named "Remove <text>".
 *
 * @example
 * <lg-tag>Draft</lg-tag>
 * <lg-tag removable (remove)="drop('angular')">Angular</lg-tag>
 */
@Component({
  selector: 'lg-tag',
  host: {
    class: 'inline-flex min-h-8 max-w-full items-center rounded-full bg-lg-surface-muted ps-3 text-sm font-medium text-lg-fg',
    '[class.pe-3]': '!removable()',
  },
  template: `
    <span data-lg-part="text" class="truncate" [id]="textId"><ng-content /></span>
    @if (removable()) {
      <button
        type="button"
        data-lg-part="remove"
        class="lg-focus-ring -my-1.5 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent bg-transparent text-lg-fg hover:bg-lg-border disabled:cursor-not-allowed disabled:opacity-60"
        [disabled]="disabled()"
        [attr.aria-labelledby]="removeId + ' ' + textId"
        (click)="remove.emit()"
      >
        <span hidden [id]="removeId">{{ i18n.remove }}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    }
  `,
})
export class LgTag {
  protected readonly i18n = inject(LG_I18N);
  /** Shows a remove button that emits `remove`. */
  readonly removable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly remove = output();

  private readonly id = lgUniqueId('lg-tag');
  protected readonly textId = `${this.id}-text`;
  protected readonly removeId = `${this.id}-remove`;
}
