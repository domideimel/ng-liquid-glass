import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';
import { LgTooltip } from '@domideimel/ng-liquid-glass/tooltip';

@Component({
  selector: 'docs-tooltip-demo',
  imports: [LgButton, LgCluster, LgTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div lgCluster gap="md" class="pt-12">
      <button lgButton type="button" aria-label="Copy link" lgTooltip="Copies the link to your clipboard">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
      <button lgButton type="button" lgTooltip="Last saved 2 minutes ago">Save</button>
    </div>
  `,
})
export class TooltipDemo {}
