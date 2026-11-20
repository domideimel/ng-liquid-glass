import { Component } from '@angular/core';
import { LgKbd } from '@domideimel/ng-liquid-glass/kbd';

@Component({
  selector: 'docs-kbd-demo',
  imports: [LgKbd],
  template: `
    <p class="m-0">
      Press
      <kbd lgKbd><kbd lgKbd>Ctrl</kbd> + <kbd lgKbd>K</kbd></kbd>
      to search, or <kbd lgKbd>Esc</kbd> to close.
    </p>
  `,
})
export class KbdDemo {}
