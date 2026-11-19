import { booleanAttribute, computed, Directive, input } from '@angular/core';

/** Breakpoints are container widths, not viewport widths: a grid adapts to the space it gets. */
export type LgBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
/** A value, or values per breakpoint, e.g. `{ base: 12, md: 6, lg: 4 }`. Larger breakpoints inherit smaller ones. */
export type LgResponsive<T> = T | Readonly<Partial<Record<LgBreakpoint, T>>>;
export type LgColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
export type LgColumnStart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto';
export type LgRowSpan = 1 | 2 | 3 | 4 | 5 | 6;
export type LgGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type LgContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Literal class tables so Tailwind can find every class at build time.
const SPAN: Record<LgBreakpoint, Record<LgColumnSpan, string>> = {
  base: {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
    full: 'col-span-full',
  },
  sm: {
    1: '@lg-sm:col-span-1',
    2: '@lg-sm:col-span-2',
    3: '@lg-sm:col-span-3',
    4: '@lg-sm:col-span-4',
    5: '@lg-sm:col-span-5',
    6: '@lg-sm:col-span-6',
    7: '@lg-sm:col-span-7',
    8: '@lg-sm:col-span-8',
    9: '@lg-sm:col-span-9',
    10: '@lg-sm:col-span-10',
    11: '@lg-sm:col-span-11',
    12: '@lg-sm:col-span-12',
    full: '@lg-sm:col-span-full',
  },
  md: {
    1: '@lg-md:col-span-1',
    2: '@lg-md:col-span-2',
    3: '@lg-md:col-span-3',
    4: '@lg-md:col-span-4',
    5: '@lg-md:col-span-5',
    6: '@lg-md:col-span-6',
    7: '@lg-md:col-span-7',
    8: '@lg-md:col-span-8',
    9: '@lg-md:col-span-9',
    10: '@lg-md:col-span-10',
    11: '@lg-md:col-span-11',
    12: '@lg-md:col-span-12',
    full: '@lg-md:col-span-full',
  },
  lg: {
    1: '@lg-lg:col-span-1',
    2: '@lg-lg:col-span-2',
    3: '@lg-lg:col-span-3',
    4: '@lg-lg:col-span-4',
    5: '@lg-lg:col-span-5',
    6: '@lg-lg:col-span-6',
    7: '@lg-lg:col-span-7',
    8: '@lg-lg:col-span-8',
    9: '@lg-lg:col-span-9',
    10: '@lg-lg:col-span-10',
    11: '@lg-lg:col-span-11',
    12: '@lg-lg:col-span-12',
    full: '@lg-lg:col-span-full',
  },
  xl: {
    1: '@lg-xl:col-span-1',
    2: '@lg-xl:col-span-2',
    3: '@lg-xl:col-span-3',
    4: '@lg-xl:col-span-4',
    5: '@lg-xl:col-span-5',
    6: '@lg-xl:col-span-6',
    7: '@lg-xl:col-span-7',
    8: '@lg-xl:col-span-8',
    9: '@lg-xl:col-span-9',
    10: '@lg-xl:col-span-10',
    11: '@lg-xl:col-span-11',
    12: '@lg-xl:col-span-12',
    full: '@lg-xl:col-span-full',
  },
};

const START: Record<LgBreakpoint, Record<LgColumnStart, string>> = {
  base: {
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
    auto: 'col-start-auto',
  },
  sm: {
    1: '@lg-sm:col-start-1',
    2: '@lg-sm:col-start-2',
    3: '@lg-sm:col-start-3',
    4: '@lg-sm:col-start-4',
    5: '@lg-sm:col-start-5',
    6: '@lg-sm:col-start-6',
    7: '@lg-sm:col-start-7',
    8: '@lg-sm:col-start-8',
    9: '@lg-sm:col-start-9',
    10: '@lg-sm:col-start-10',
    11: '@lg-sm:col-start-11',
    12: '@lg-sm:col-start-12',
    auto: '@lg-sm:col-start-auto',
  },
  md: {
    1: '@lg-md:col-start-1',
    2: '@lg-md:col-start-2',
    3: '@lg-md:col-start-3',
    4: '@lg-md:col-start-4',
    5: '@lg-md:col-start-5',
    6: '@lg-md:col-start-6',
    7: '@lg-md:col-start-7',
    8: '@lg-md:col-start-8',
    9: '@lg-md:col-start-9',
    10: '@lg-md:col-start-10',
    11: '@lg-md:col-start-11',
    12: '@lg-md:col-start-12',
    auto: '@lg-md:col-start-auto',
  },
  lg: {
    1: '@lg-lg:col-start-1',
    2: '@lg-lg:col-start-2',
    3: '@lg-lg:col-start-3',
    4: '@lg-lg:col-start-4',
    5: '@lg-lg:col-start-5',
    6: '@lg-lg:col-start-6',
    7: '@lg-lg:col-start-7',
    8: '@lg-lg:col-start-8',
    9: '@lg-lg:col-start-9',
    10: '@lg-lg:col-start-10',
    11: '@lg-lg:col-start-11',
    12: '@lg-lg:col-start-12',
    auto: '@lg-lg:col-start-auto',
  },
  xl: {
    1: '@lg-xl:col-start-1',
    2: '@lg-xl:col-start-2',
    3: '@lg-xl:col-start-3',
    4: '@lg-xl:col-start-4',
    5: '@lg-xl:col-start-5',
    6: '@lg-xl:col-start-6',
    7: '@lg-xl:col-start-7',
    8: '@lg-xl:col-start-8',
    9: '@lg-xl:col-start-9',
    10: '@lg-xl:col-start-10',
    11: '@lg-xl:col-start-11',
    12: '@lg-xl:col-start-12',
    auto: '@lg-xl:col-start-auto',
  },
};

const ROW_SPAN: Record<LgRowSpan, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
  5: 'row-span-5',
  6: 'row-span-6',
};

const GAP: Record<LgGap, string> = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-10' };

const CONTAINER: Record<LgContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-none',
};

function responsiveClasses<T extends string | number>(
  value: LgResponsive<T> | undefined,
  table: Record<LgBreakpoint, Record<T, string>>,
): string {
  if (value === undefined) return '';
  if (typeof value !== 'object') return table.base[value];
  return (Object.keys(value) as LgBreakpoint[])
    .map((breakpoint) => {
      const v = value[breakpoint];
      return v === undefined ? '' : table[breakpoint][v];
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * A 12-column CSS grid whose children respond to the grid's own width (container queries),
 * so the same layout works in a page, a sidebar or a dialog. With `minItemWidth` it becomes an
 * intrinsic auto-fill grid that needs no breakpoints.
 *
 * @example
 * <div lgGrid gap="lg">
 *   <article lgCol [span]="{ base: 12, md: 6, lg: 4 }">…</article>
 * </div>
 * <ul lgGrid minItemWidth="16rem">…</ul>
 */
@Directive({
  selector: '[lgGrid]',
  host: {
    class: 'grid @container',
    '[class]': 'classes()',
    '[style.--lg-grid-min]': 'minItemWidth() || null',
  },
})
export class LgGrid {
  readonly gap = input<LgGap>('md');
  /** Switches to an auto-fill grid with items at least this wide, e.g. `16rem`. */
  readonly minItemWidth = input('');
  protected readonly classes = computed(
    () =>
      `${GAP[this.gap()]} ${this.minItemWidth() ? 'grid-cols-[repeat(auto-fill,minmax(min(var(--lg-grid-min),100%),1fr))]' : 'grid-cols-12'}`,
  );
}

/** A cell of an `lgGrid`. Without `span` it fills the whole row. */
@Directive({
  selector: '[lgCol]',
  host: { '[class]': 'classes()' },
})
export class LgCol {
  readonly span = input<LgResponsive<LgColumnSpan>>('full');
  readonly start = input<LgResponsive<LgColumnStart>>();
  /** Spans this many rows and shares the grid's row tracks (subgrid), so card parts line up across a row. */
  readonly rows = input<LgRowSpan>();
  /** Lets this cell's children use the parent's column tracks (subgrid). */
  readonly subgrid = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() => {
    const rows = this.rows();
    return [
      responsiveClasses(this.span(), SPAN),
      responsiveClasses(this.start(), START),
      rows === undefined ? '' : `grid grid-rows-subgrid ${ROW_SPAN[rows]}`,
      this.subgrid() ? 'grid grid-cols-subgrid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}

/** Centers content with a maximum width and responsive side padding. */
@Directive({
  selector: '[lgContainer]',
  host: { class: 'mx-auto w-full px-4 sm:px-6 lg:px-8', '[class]': 'sizeClass()' },
})
export class LgContainer {
  readonly size = input<LgContainerSize>('lg');
  protected readonly sizeClass = computed(() => CONTAINER[this.size()]);
}

/** Stacks children vertically with consistent spacing. */
@Directive({
  selector: '[lgStack]',
  host: { class: 'flex flex-col', '[class]': 'gapClass()' },
})
export class LgStack {
  readonly gap = input<LgGap>('md');
  protected readonly gapClass = computed(() => GAP[this.gap()]);
}

/** Lays children out in a row that wraps, e.g. buttons or tags. */
@Directive({
  selector: '[lgCluster]',
  host: { class: 'flex flex-wrap items-center', '[class]': 'gapClass()' },
})
export class LgCluster {
  readonly gap = input<LgGap>('sm');
  protected readonly gapClass = computed(() => GAP[this.gap()]);
}
