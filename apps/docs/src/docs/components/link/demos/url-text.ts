import { Component } from '@angular/core';
import { LgLink, LgUrlText } from '@domideimel/ng-liquid-glass/link';

@Component({
  selector: 'docs-url-text-demo',
  imports: [LgLink, LgUrlText],
  template: `
    <p class="m-0 max-w-64">
      <a lgLink [href]="url"><lg-url-text [url]="url" /></a>
    </p>
  `,
})
export class UrlTextDemo {
  protected readonly url = 'https://example.com/tools/encode?input=hello%20world&format=base64#result';
}
