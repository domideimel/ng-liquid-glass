import { Component, signal } from '@angular/core';
import { LgBadge } from '@domideimel/ng-liquid-glass/badge';
import { LgButton } from '@domideimel/ng-liquid-glass/button';

@Component({
  selector: 'docs-button-badge-demo',
  imports: [LgBadge, LgButton],
  template: `
    <button
      lgButton
      shape="circle"
      variant="ghost"
      type="button"
      class="relative"
      [attr.aria-label]="'Setlist, ' + count() + ' songs'"
      (click)="count.set(count() + 1)"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
      <span lgBadge variant="info" aria-hidden="true" class="absolute -end-1 -top-1 min-w-5 justify-center px-1.5 tabular-nums">{{
        count()
      }}</span>
    </button>
  `,
})
export class ButtonBadgeDemo {
  protected readonly count = signal(3);
}
