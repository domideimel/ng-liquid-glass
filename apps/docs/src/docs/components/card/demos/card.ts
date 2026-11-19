import { Component } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCard } from '@domideimel/ng-liquid-glass/card';
import { LgCol, LgGrid } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-card-demo',
  imports: [LgButton, LgCard, LgCol, LgGrid],
  template: `
    <div lgGrid gap="lg" class="rounded-lg-surface bg-[linear-gradient(135deg,#a5b4fc,#fbcfe8)] p-6">
      <article lgCard lgCol [span]="{ base: 12, md: 6 }">
        <h2 class="mt-0 text-lg font-semibold">Solid card</h2>
        <p>For most content.</p>
        <button lgButton type="button">Open</button>
      </article>
      <article lgCard glass lgCol [span]="{ base: 12, md: 6 }">
        <h2 class="mt-0 text-lg font-semibold">Glass card</h2>
        <p>For content over imagery.</p>
        <button lgButton variant="primary" type="button">Open</button>
      </article>
    </div>
  `,
})
export class CardDemo {}
