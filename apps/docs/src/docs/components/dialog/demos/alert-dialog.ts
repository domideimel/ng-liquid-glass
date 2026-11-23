import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgDialog, LgDialogClose, LgDialogDescription, LgDialogTitle } from '@domideimel/ng-liquid-glass/dialog';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-alert-dialog-demo',
  imports: [LgButton, LgCluster, LgDialog, LgDialogClose, LgDialogDescription, LgDialogTitle],
  template: `
    <button lgButton variant="danger" type="button" (click)="open.set(true)">Delete setlist</button>
    <p class="mt-3 mb-0">{{ result() }}</p>
    <lg-dialog alert [(open)]="open">
      <h2 lgDialogTitle>Delete “Sunday rehearsal”?</h2>
      <p lgDialogDescription>The setlist is removed. Its 12 songs stay in your library.</p>
      <div lgCluster>
        <button lgButton type="button" lgDialogClose>Keep setlist</button>
        <button lgButton variant="danger" type="button" (click)="delete()">Delete</button>
      </div>
    </lg-dialog>
  `,
})
export class AlertDialogDemo {
  protected readonly open = signal(false);
  protected readonly result = signal('The setlist is still there.');

  protected delete(): void {
    this.result.set('Setlist deleted.');
    this.open.set(false);
  }
}
