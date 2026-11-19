import { Directive, inject, input } from '@angular/core';
import { LG_I18N } from '@domideimel/ng-liquid-glass';

/**
 * Styles a breadcrumb trail. You provide the list and links, so `routerLink` works as usual;
 * mark the current page with `aria-current="page"`.
 *
 * @example
 * <nav lgBreadcrumbs><ol><li><a routerLink="/">Home</a></li><li><a aria-current="page">Settings</a></li></ol></nav>
 */
@Directive({
  selector: 'nav[lgBreadcrumbs]',
  host: {
    '[attr.aria-label]': 'label() || i18n.breadcrumbs',
    class:
      "text-lg-fg [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:rounded-lg-control [&_a]:underline [&_a]:underline-offset-4 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-lg-focus [&_[aria-current=page]]:font-semibold [&_[aria-current=page]]:no-underline [&_li]:inline-flex [&_li]:items-center [&_li]:gap-3 [&_li+li]:before:size-1.5 [&_li+li]:before:rotate-45 [&_li+li]:before:border-t-2 [&_li+li]:before:border-r-2 [&_li+li]:before:border-lg-fg-muted [&_li+li]:before:content-[''] [&_ol]:m-0 [&_ol]:flex [&_ol]:list-none [&_ol]:flex-wrap [&_ol]:items-center [&_ol]:gap-3 [&_ol]:p-0",
  },
})
export class LgBreadcrumbs {
  protected readonly i18n = inject(LG_I18N);
  /** Accessible name; defaults to the translated "Breadcrumb". */
  readonly label = input('');
}
