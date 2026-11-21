import { Component, HostAttributeToken, inject } from '@angular/core';
import { LG_I18N } from '@domideimel/ng-liquid-glass';

/**
 * Styles a native `<a>` as an underlined text link. Links with `target="_blank"` get an icon and tell
 * screen readers that they open a new tab (WCAG 3.2.5).
 *
 * @example
 * <p>Read the <a lgLink href="/terms">terms</a>.</p>
 * <a lgLink href="https://angular.dev" target="_blank" rel="noopener">Angular</a>
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- enhances the native <a> element
  selector: 'a[lgLink]',
  host: {
    class:
      'lg-focus-ring rounded-sm font-medium text-lg-fg underline decoration-1 underline-offset-4 hover:decoration-2 [&[aria-current]]:font-semibold [&[aria-current]]:no-underline',
  },
  template: `<ng-content />
    @if (external) {
      &ngsp;<span class="sr-only">({{ i18n.opensInNewTab }})</span>
      <svg
        aria-hidden="true"
        class="inline-block size-[0.875em] align-[-0.0625em] rtl:-scale-x-100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
    }`,
})
export class LgLink {
  protected readonly i18n = inject(LG_I18N);
  protected readonly external = inject(new HostAttributeToken('target'), { optional: true }) === '_blank';
}
