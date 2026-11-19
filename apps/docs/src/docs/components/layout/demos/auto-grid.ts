import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LgGrid } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-auto-grid-demo',
  imports: [LgGrid],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul lgGrid minItemWidth="12rem" class="m-0 list-none p-0">
      @for (n of [1, 2, 3, 4, 5, 6, 7]; track n) {
        <li class="rounded-lg-control bg-lg-surface-muted p-4">Tile {{ n }}</li>
      }
    </ul>
  `,
})
export class AutoGridDemo {}
