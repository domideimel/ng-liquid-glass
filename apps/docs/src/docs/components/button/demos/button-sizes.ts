import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-button-sizes-demo',
  imports: [LgButton, LgCluster],
  template: `
    <div lgCluster gap="md">
      <button lgButton size="sm" type="button">−1</button>
      <button lgButton type="button">Medium</button>
      <button lgButton size="lg" type="button">Large</button>
      <button lgButton size="xl" variant="primary" type="button">Extra large</button>
    </div>
    <div lgCluster gap="md" class="mt-4">
      <button lgButton shape="circle" size="sm" variant="ghost" type="button" aria-label="Decrease tempo">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
      <button lgButton shape="circle" variant="ghost" type="button" aria-label="Settings">
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
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      </button>
      <button
        lgButton
        shape="circle"
        size="xl"
        variant="accent"
        type="button"
        [attr.aria-label]="playing() ? 'Stop' : 'Play'"
        (click)="playing.set(!playing())"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
          @if (playing()) {
            <rect x="6" y="6" width="12" height="12" rx="1" />
          } @else {
            <path d="M8 5v14l11-7z" />
          }
        </svg>
      </button>
    </div>
  `,
})
export class ButtonSizesDemo {
  protected readonly playing = signal(false);
}
