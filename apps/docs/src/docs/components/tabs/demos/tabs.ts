import { Component, signal } from '@angular/core';
import { LgTab, LgTabPanel, LgTabs } from '@domideimel/ng-liquid-glass/tabs';

@Component({
  selector: 'docs-tabs-demo',
  imports: [LgTab, LgTabPanel, LgTabs],
  template: `
    <lg-tabs label="Account settings" [(value)]="tab">
      <button lgTab type="button" value="profile">Profile</button>
      <button lgTab type="button" value="security">Security</button>
      <button lgTab type="button" value="billing" disabled>Billing</button>
      <button lgTab type="button" value="notifications">Notifications</button>
      <div lgTabPanel value="profile"><p>Your name, photo and bio.</p></div>
      <div lgTabPanel value="security"><p>Passkeys, two-factor authentication and sessions.</p></div>
      <div lgTabPanel value="billing"><p>Invoices and payment methods.</p></div>
      <div lgTabPanel value="notifications"><p>Choose what we email you about.</p></div>
    </lg-tabs>
  `,
})
export class TabsDemo {
  protected readonly tab = signal('profile');
}
