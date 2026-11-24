import { Component, computed, inject, input, model, numberAttribute } from '@angular/core';
import { LG_I18N } from '@domideimel/ng-liquid-glass';

/** The page numbers to show: first, last and a window around the current page, with gaps as `null`. */
export function lgPageWindow(page: number, pageCount: number, siblings = 1): (number | null)[] {
  const shown = (p: number): boolean => p === 1 || p === pageCount || Math.abs(p - page) <= siblings;
  const pages: (number | null)[] = [];
  for (let p = 1; p <= pageCount; p++) {
    // A gap of exactly one page shows that page: "…" would take the same space and hide it.
    if (shown(p) || (shown(p - 1) && shown(p + 1))) pages.push(p);
    else if (pages.at(-1) !== null) pages.push(null);
  }
  return pages;
}

/** Page navigation with previous/next buttons; the current page is marked with `aria-current`. */
@Component({
  selector: 'lg-pagination',
  host: { class: 'block' },
  template: `
    <nav [attr.aria-label]="label() || i18n.pagination">
      <ul class="m-0 flex list-none flex-wrap items-center gap-1 p-0">
        <li>
          <button
            type="button"
            [class]="buttonClass"
            [attr.aria-disabled]="page() <= 1 || null"
            [attr.aria-label]="i18n.previousPage"
            (click)="go(page() - 1)"
          >
            <svg
              aria-hidden="true"
              class="rtl:-scale-x-100"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </li>
        @for (p of pages(); track $index) {
          <li>
            @if (p === null) {
              <span aria-hidden="true" class="inline-flex size-lg-control items-center justify-center text-lg-fg-muted">…</span>
            } @else {
              <button
                type="button"
                [class]="p === page() ? activeClass : buttonClass"
                [attr.aria-label]="i18n.page(p)"
                [attr.aria-current]="p === page() ? 'page' : null"
                (click)="go(p)"
              >
                {{ p }}
              </button>
            }
          </li>
        }
        <li>
          <button
            type="button"
            [class]="buttonClass"
            [attr.aria-disabled]="page() >= pageCount() || null"
            [attr.aria-label]="i18n.nextPage"
            (click)="go(page() + 1)"
          >
            <svg
              aria-hidden="true"
              class="rtl:-scale-x-100"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  `,
})
export class LgPagination {
  protected readonly i18n = inject(LG_I18N);
  /** The current page, starting at 1. */
  readonly page = model(1);
  readonly pageCount = input.required({ transform: numberAttribute });
  /** Accessible name; defaults to the translated "Pagination". */
  readonly label = input('');

  protected readonly pages = computed(() => lgPageWindow(this.page(), this.pageCount()));
  protected readonly buttonClass =
    'lg-focus-ring inline-flex min-h-lg-control min-w-lg-control cursor-pointer border border-transparent bg-transparent font-[inherit] text-base items-center justify-center rounded-lg-control px-3 font-medium text-lg-fg hover:bg-lg-surface-muted aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:bg-transparent';
  protected readonly activeClass =
    'lg-focus-ring inline-flex min-h-lg-control min-w-lg-control cursor-pointer border border-transparent bg-lg-primary lg-forced-selected font-[inherit] text-base items-center justify-center rounded-lg-control px-3 font-medium text-lg-on-primary';

  /** Clamped to the valid range, so the aria-disabled previous/next buttons do nothing at the ends. */
  protected go(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.pageCount()));
  }
}
