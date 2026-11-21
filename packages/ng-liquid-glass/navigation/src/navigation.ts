import { Directive } from '@angular/core';

/**
 * Side navigation: a `nav` with lists of `a[lgNavLink]` and collapsible `details[lgNavGroup]` sections.
 * Mark the current page with `aria-current="page"` (with the router: `ariaCurrentWhenActive="page"`).
 * Name the `nav` with `aria-label` when the page has more than one.
 *
 * @example
 * <nav lgNav aria-label="Settings">
 *   <ul>
 *     <li><a lgNavLink routerLink="/profile" ariaCurrentWhenActive="page">Profile</a></li>
 *     <li>
 *       <details lgNavGroup open>
 *         <summary>Billing</summary>
 *         <ul><li><a lgNavLink routerLink="/invoices" ariaCurrentWhenActive="page">Invoices</a></li></ul>
 *       </details>
 *     </li>
 *   </ul>
 * </nav>
 */
@Directive({
  selector: 'nav[lgNav]',
  host: {
    class:
      'block text-lg-fg [&_ul]:m-0 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-col [&_ul]:gap-0.5 [&_ul]:p-0 [&_ul_ul]:mt-0.5 [&_ul_ul]:ms-3 [&_ul_ul]:border-s [&_ul_ul]:border-lg-border [&_ul_ul]:ps-2',
  },
})
export class LgNav {}

/** A link in `nav[lgNav]`; `aria-current="page"` highlights it. */
@Directive({
  selector: 'a[lgNavLink]',
  host: {
    class:
      'lg-focus-ring flex min-h-11 items-center gap-2 rounded-lg-control px-3 font-medium text-lg-fg-muted no-underline hover:bg-lg-surface-muted hover:text-lg-fg aria-[current=page]:bg-lg-surface-muted aria-[current=page]:font-semibold aria-[current=page]:text-lg-fg aria-[current=page]:lg-forced-selected',
  },
})
export class LgNavLink {}

/** A collapsible section of `nav[lgNav]`, built on `<details>`; its `<summary>` is the section title. */
@Directive({
  selector: 'details[lgNavGroup]',
  host: {
    class:
      "group [&>summary]:lg-focus-ring [&>summary]:flex [&>summary]:min-h-11 [&>summary]:cursor-pointer [&>summary]:list-none [&>summary]:items-center [&>summary]:justify-between [&>summary]:gap-2 [&>summary]:rounded-lg-control [&>summary]:px-3 [&>summary]:font-semibold [&>summary:hover]:bg-lg-surface-muted [&>summary::-webkit-details-marker]:hidden [&>summary]:after:size-2 [&>summary]:after:shrink-0 [&>summary]:after:rotate-45 [&>summary]:after:border-r-2 [&>summary]:after:border-b-2 [&>summary]:after:border-current [&>summary]:after:transition-transform [&>summary]:after:content-[''] open:[&>summary]:after:-rotate-135",
  },
})
export class LgNavGroup {}
