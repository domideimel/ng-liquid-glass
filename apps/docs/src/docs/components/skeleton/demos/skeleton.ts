import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LgSkeleton } from '@domideimel/ng-liquid-glass/skeleton';

@Component({
  selector: 'docs-skeleton-demo',
  imports: [LgSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div aria-busy="true" class="flex max-w-md gap-4">
      <lg-skeleton class="size-12 rounded-full" />
      <div class="flex flex-1 flex-col gap-2">
        <lg-skeleton class="h-4 w-1/2" />
        <lg-skeleton class="h-4" />
        <lg-skeleton class="h-4 w-3/4" />
      </div>
    </div>
  `,
})
export class SkeletonDemo {}
