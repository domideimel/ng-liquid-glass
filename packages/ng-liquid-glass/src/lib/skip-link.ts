import { Directive } from '@angular/core';

/**
 * A link that is only visible on keyboard focus and jumps past repeated navigation
 * (WCAG 2.4.1 Bypass Blocks). Place it first in the page: `<a lgSkipLink href="#main">Skip to content</a>`.
 */
@Directive({
  selector: 'a[lgSkipLink]',
  host: {
    class:
      'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg-control focus:bg-lg-primary focus:px-4 focus:text-lg-on-primary lg-focus-ring',
  },
})
export class LgSkipLink {}
