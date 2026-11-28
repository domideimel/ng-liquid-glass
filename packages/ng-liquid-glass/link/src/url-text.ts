import { Component, computed, input } from '@angular/core';

/**
 * Shows a URL that wraps after `/`, `?`, `&`, `=` and `#` instead of in the middle of a word, by
 * inserting `<wbr>` after each of them. Copying the text and screen readers are unaffected. A part that
 * still doesn't fit (a long token) breaks anywhere rather than overflowing.
 *
 * @example
 * <a lgLink [href]="shortUrl()"><lg-url-text [url]="shortUrl()" /></a>
 * <p lgOutput><lg-url-text [url]="encoded()" /></p>
 */
@Component({
  selector: 'lg-url-text',
  host: { class: '[overflow-wrap:anywhere]' },
  template: `@for (part of parts(); track $index) {
    <ng-container>{{ part }}</ng-container>
    @if (!$last) {
      <wbr />
    }
  }`,
})
export class LgUrlText {
  readonly url = input.required<string>();

  protected readonly parts = computed(() => this.url().split(/(?<=[/?&=#])/));
}
