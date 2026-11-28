import { Component } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCard, LgCardActions, LgCardHeader } from '@domideimel/ng-liquid-glass/card';
import { LgCopyButton } from '@domideimel/ng-liquid-glass/copy-button';
import { LgOutput } from '@domideimel/ng-liquid-glass/output';

@Component({
  selector: 'docs-card-header-demo',
  imports: [LgButton, LgCard, LgCardActions, LgCardHeader, LgCopyButton, LgOutput],
  template: `
    <section lgCard class="max-w-xl" aria-labelledby="sha-title">
      <header lgCardHeader>
        <h2 id="sha-title">SHA-256</h2>
        <div lgCardActions>
          <lg-copy-button label="Copy hash" [value]="hash" />
          <button lgButton variant="ghost" shape="circle" type="button" aria-label="Download hash">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 4v12M7 11l5 5 5-5M4 20h16" />
            </svg>
          </button>
        </div>
      </header>
      <output lgOutput mono>{{ hash }}</output>
    </section>
  `,
})
export class CardHeaderDemo {
  protected readonly hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
}
