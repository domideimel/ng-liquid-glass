import { Directive } from '@angular/core';

/**
 * A bordered list with dividers, for rows of results that each have a few actions (copy, delete). Use it on
 * `<ul>` or `<ol>` with `li[lgListItem]` rows; give it an accessible name when there are several lists.
 *
 * @example
 * <ul lgList aria-label="Generated passwords">
 *   <li lgListItem>
 *     <code>a8#Kd2!pQ</code>
 *     <div lgListActions>
 *       <lg-copy-button [value]="'a8#Kd2!pQ'" />
 *       <button lgButton variant="ghost" shape="circle" aria-label="Remove">…</button>
 *     </div>
 *   </li>
 * </ul>
 */
@Directive({
  selector: 'ul[lgList], ol[lgList]',
  host: {
    // list-style: none drops the list role in Safari, so state it.
    role: 'list',
    class: 'm-0 list-none divide-y divide-lg-border rounded-lg-surface border border-lg-border bg-lg-surface p-0 text-lg-fg',
  },
})
export class LgList {}

/** A row of `[lgList]`: its first child takes the free space and wraps; `[lgListActions]` sits at the end. */
@Directive({
  selector: 'li[lgListItem]',
  host: {
    class:
      'flex min-h-lg-control flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 [overflow-wrap:anywhere] [&>:first-child]:min-w-0 [&>:first-child]:flex-1',
  },
})
export class LgListItem {}

/** The actions of a list row, kept together on its end side. */
@Directive({
  selector: '[lgListActions]',
  host: { class: 'ms-auto flex shrink-0 items-center gap-1' },
})
export class LgListActions {}
