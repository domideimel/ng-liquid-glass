import { Directive } from '@angular/core';

/** A placeholder shape while content loads. Mark the loading region with `aria-busy="true"`. */
@Directive({
  selector: 'lg-skeleton, [lgSkeleton]',
  host: {
    'aria-hidden': 'true',
    class:
      'block min-h-4 animate-pulse rounded-lg-control bg-lg-surface-muted motion-reduce:animate-none forced-colors:border forced-colors:border-[GrayText]',
  },
})
export class LgSkeleton {}
