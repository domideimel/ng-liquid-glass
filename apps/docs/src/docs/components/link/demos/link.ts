import { Component } from '@angular/core';
import { LgLink } from '@domideimel/ng-liquid-glass/link';

@Component({
  selector: 'docs-link-demo',
  imports: [LgLink],
  template: `
    <p class="m-0">
      By signing up you accept the <a lgLink href="#terms">terms of service</a>. The library is built on
      <a lgLink href="https://angular.dev" target="_blank" rel="noopener">Angular</a>.
    </p>
  `,
})
export class LinkDemo {}
