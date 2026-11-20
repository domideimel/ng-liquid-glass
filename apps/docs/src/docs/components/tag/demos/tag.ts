import { Component, signal } from '@angular/core';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';
import { LgTag } from '@domideimel/ng-liquid-glass/tag';

@Component({
  selector: 'docs-tag-demo',
  imports: [LgCluster, LgTag],
  template: `
    <ul lgCluster class="m-0 list-none p-0" aria-label="Active filters">
      @for (filter of filters(); track filter) {
        <li>
          <lg-tag removable (remove)="remove(filter)">{{ filter }}</lg-tag>
        </li>
      }
      <li><lg-tag>Read-only</lg-tag></li>
    </ul>
  `,
})
export class TagDemo {
  protected readonly filters = signal(['Open', 'Assigned to me', 'This week']);

  protected remove(filter: string): void {
    this.filters.update((filters) => filters.filter((f) => f !== filter));
  }
}
