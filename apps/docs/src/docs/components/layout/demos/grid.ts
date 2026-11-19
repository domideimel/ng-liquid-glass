import { Component } from '@angular/core';
import { LgCol, LgGrid } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-grid-demo',
  imports: [LgCol, LgGrid],
  template: `
    <div lgGrid>
      <div lgCol class="rounded-lg-control bg-lg-surface-muted p-4">Header — full width</div>
      <div lgCol [span]="{ base: 12, md: 8 }" class="rounded-lg-control bg-lg-surface-muted p-4">Main — 12 → 8</div>
      <div lgCol [span]="{ base: 12, md: 4 }" class="rounded-lg-control bg-lg-surface-muted p-4">Aside — 12 → 4</div>
      @for (n of [1, 2, 3, 4]; track n) {
        <div lgCol [span]="{ base: 12, sm: 6, lg: 3 }" class="rounded-lg-control bg-lg-surface-muted p-4">Item {{ n }}</div>
      }
    </div>
  `,
})
export class GridDemo {}
