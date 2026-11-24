import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgDialog, LgDialogClose, LgDialogTitle, type LgDialogPlacement } from '@domideimel/ng-liquid-glass/dialog';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-drawer-demo',
  imports: [LgButton, LgCluster, LgDialog, LgDialogClose, LgDialogTitle],
  template: `
    <div lgCluster>
      <button lgButton type="button" (click)="show('start')">Navigation drawer</button>
      <button lgButton type="button" (click)="show('end')">Details drawer</button>
      <button lgButton type="button" (click)="show('bottom')">Bottom sheet</button>
    </div>
    <lg-dialog dismissible [placement]="placement()" [(open)]="open">
      <h2 lgDialogTitle>{{ titles[placement()] }}</h2>
      <p>Drawers keep the page in view while showing more detail or navigation.</p>
      <button lgButton type="button" lgDialogClose>Close</button>
    </lg-dialog>
  `,
})
export class DrawerDemo {
  protected readonly open = signal(false);
  protected readonly placement = signal<LgDialogPlacement>('end');
  protected readonly titles: Record<LgDialogPlacement, string> = {
    center: 'Dialog',
    start: 'Navigation',
    end: 'Order details',
    bottom: 'Share',
    sheet: 'Setlists',
  };

  protected show(placement: LgDialogPlacement): void {
    this.placement.set(placement);
    this.open.set(true);
  }
}
