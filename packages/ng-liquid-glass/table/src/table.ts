import { Component, computed, Directive, inject, input, model } from '@angular/core';

export type LgSortDirection = 'ascending' | 'descending';

/** The sorted column and its direction. */
export interface LgSort {
  readonly active: string;
  readonly direction: LgSortDirection;
}

/**
 * Styles a native `<table>` and, with `[(sort)]`, coordinates its `th[lgSortHeader]` columns. Sorting the
 * rows is up to you (see `lgSortRows`). Give it a `<caption>`.
 *
 * @example
 * <table lgTable [(sort)]="sort">
 *   <caption>Invoices</caption>
 *   <thead><tr><th lgSortHeader="number">Number</th><th lgSortHeader="amount">Amount</th></tr></thead>
 *   <tbody>@for (row of rows(); track row.number) { <tr><td>{{ row.number }}</td><td>{{ row.amount }}</td></tr> }</tbody>
 * </table>
 */
@Directive({
  selector: 'table[lgTable]',
  host: {
    class:
      'w-full border-collapse text-start text-lg-fg [&_caption]:mb-2 [&_caption]:text-start [&_caption]:font-semibold [&_th]:border-b-2 [&_th]:border-lg-control-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-start [&_th]:font-semibold [&_td]:border-b [&_td]:border-lg-border [&_td]:px-3 [&_td]:py-2.5 [&_tbody_tr:hover]:bg-lg-surface-muted',
  },
})
export class LgTable {
  /** The sorted column; `null` for the original order. */
  readonly sort = model<LgSort | null>(null);
}

/**
 * A sortable column header. Its value is the column key used in `LgSort.active`. Activating it sorts
 * ascending, then toggles the direction; the column exposes the state with `aria-sort`.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- enhances the native <th> element
  selector: 'th[lgSortHeader]',
  host: { '[attr.aria-sort]': 'direction()', class: '!p-0' },
  template: `
    <button
      type="button"
      class="lg-focus-ring flex min-h-lg-control w-full cursor-pointer items-center gap-2 rounded-lg-control border border-transparent bg-transparent px-3 py-2 text-start font-[inherit] text-base font-semibold text-lg-fg hover:bg-lg-surface-muted"
      (click)="toggle()"
    >
      <ng-content />
      <svg
        aria-hidden="true"
        class="ms-auto shrink-0"
        [class.opacity-40]="!direction()"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        @switch (direction()) {
          @case ('ascending') {
            <path d="m6 15 6-6 6 6" />
          }
          @case ('descending') {
            <path d="m6 9 6 6 6-6" />
          }
          @default {
            <path d="m7 9 5-5 5 5M7 15l5 5 5-5" />
          }
        }
      </svg>
    </button>
  `,
})
export class LgSortHeader {
  private readonly table = inject(LgTable);
  /** The column key. */
  readonly lgSortHeader = input.required<string>();

  protected readonly direction = computed(() => {
    const sort = this.table.sort();
    return sort?.active === this.lgSortHeader() ? sort.direction : null;
  });

  protected toggle(): void {
    this.table.sort.set({
      active: this.lgSortHeader(),
      direction: this.direction() === 'ascending' ? 'descending' : 'ascending',
    });
  }
}

/**
 * Makes a wide table scrollable on small screens. The region is focusable so keyboard users can
 * scroll it; name it with `aria-label` or `aria-labelledby` (the caption's id).
 */
@Directive({
  selector: '[lgTableScroll]',
  host: { role: 'region', tabindex: '0', class: 'lg-focus-ring block max-w-full overflow-x-auto rounded-lg-control' },
})
export class LgTableScroll {}

/**
 * Returns `rows` sorted by `sort` (a copy; `rows` itself is unchanged). Values are compared as numbers
 * when both are numbers, otherwise as strings with `Intl.Collator` (numeric-aware).
 *
 * @example
 * readonly rows = computed(() => lgSortRows(this.invoices(), this.sort()));
 */
export function lgSortRows<T>(
  rows: readonly T[],
  sort: LgSort | null,
  accessor: (row: T, column: string) => unknown = (row, column) => (row as Record<string, unknown>)[column],
): T[] {
  if (!sort) return [...rows];
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const factor = sort.direction === 'ascending' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = accessor(a, sort.active);
    const y = accessor(b, sort.active);
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * factor;
    return collator.compare(sortText(x), sortText(y)) * factor;
  });
}

function sortText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  if (value instanceof Date) return value.toISOString();
  return value === null || value === undefined ? '' : JSON.stringify(value);
}
