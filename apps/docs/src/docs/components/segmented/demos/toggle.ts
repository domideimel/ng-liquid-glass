import { Component, signal } from '@angular/core';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';
import { LgToggle } from '@domideimel/ng-liquid-glass/segmented';

@Component({
  selector: 'docs-toggle-demo',
  imports: [LgCluster, LgToggle],
  template: `
    <div lgCluster>
      <button lgToggle type="button" [(pressed)]="muted">{{ muted() ? 'Unmute' : 'Mute' }} notifications</button>
      <button lgToggle type="button" [(pressed)]="pinned">Pinned</button>
    </div>
  `,
})
export class ToggleDemo {
  protected readonly muted = signal(false);
  protected readonly pinned = signal(true);
}
