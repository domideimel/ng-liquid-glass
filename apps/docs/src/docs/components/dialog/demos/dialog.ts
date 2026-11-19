import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgDialog, LgDialogClose, LgDialogTitle } from '@domideimel/ng-liquid-glass/dialog';

@Component({
  selector: 'docs-dialog-demo',
  imports: [LgButton, LgDialog, LgDialogClose, LgDialogTitle],
  template: `
    <button lgButton variant="danger" type="button" (click)="open.set(true)">Delete project</button>
    <lg-dialog [(open)]="open">
      <h2 lgDialogTitle>Delete “Website relaunch”?</h2>
      <p>The project, its 12 tasks and all files are deleted for everyone. This cannot be undone.</p>
      <div class="mt-6 flex justify-end gap-2">
        <button lgButton lgDialogClose type="button">Cancel</button>
        <button lgButton variant="danger" type="button" (click)="open.set(false)">Delete</button>
      </div>
    </lg-dialog>
  `,
})
export class DialogDemo {
  protected readonly open = signal(false);
}
