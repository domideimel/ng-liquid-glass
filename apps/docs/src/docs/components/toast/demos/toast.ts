import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';
import { LgToaster } from '@domideimel/ng-liquid-glass/toast';

@Component({
  selector: 'docs-toast-demo',
  imports: [LgButton, LgCluster],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div lgCluster gap="md">
      <button lgButton type="button" (click)="saved()">Save</button>
      <button lgButton type="button" (click)="archived()">Archive (with undo)</button>
      <button lgButton type="button" (click)="failed()">Simulate error</button>
      <button lgButton type="button" (click)="timed()">Timed (5 s)</button>
    </div>
  `,
})
export class ToastDemo {
  private readonly toaster = inject(LgToaster);

  protected saved(): void {
    this.toaster.show({ message: 'Changes saved', status: 'success' });
  }

  protected archived(): void {
    this.toaster.show({
      message: 'Project archived',
      action: { label: 'Undo', run: () => this.toaster.show({ message: 'Project restored' }) },
    });
  }

  protected failed(): void {
    this.toaster.show({ message: 'Could not reach the server', status: 'danger' });
  }

  protected timed(): void {
    this.toaster.show({ message: 'Link copied', duration: 5000 });
  }
}
