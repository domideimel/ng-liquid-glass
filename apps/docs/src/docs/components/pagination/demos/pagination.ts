import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LgPagination } from '@domideimel/ng-liquid-glass/pagination';

@Component({
  selector: 'docs-pagination-demo',
  imports: [LgPagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lg-pagination pageCount="12" [(page)]="page" />
    <p class="mt-4">Showing page {{ page() }} of 12</p>
  `,
})
export class PaginationDemo {
  protected readonly page = signal(4);
}
