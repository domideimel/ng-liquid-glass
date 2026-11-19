import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-button-demo',
  imports: [LgButton, LgCluster],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div lgCluster gap="md">
      <button lgButton variant="primary" type="button">Primary</button>
      <button lgButton type="button">Secondary</button>
      <button lgButton variant="ghost" type="button">Ghost</button>
      <button lgButton variant="danger" type="button">Delete</button>
      <button lgButton type="button" [loading]="saving()" (click)="save()">{{ saving() ? 'Saving…' : 'Save' }}</button>
      <button lgButton type="button" disabled>Disabled</button>
    </div>
  `,
})
export class ButtonDemo {
  protected readonly saving = signal(false);

  protected save(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
    }, 1500);
  }
}
