import { Component, signal } from '@angular/core';
import { LgNav, LgNavGroup, LgNavLink } from '@domideimel/ng-liquid-glass/navigation';

@Component({
  selector: 'docs-navigation-demo',
  imports: [LgNav, LgNavGroup, LgNavLink],
  template: `
    <nav lgNav aria-label="Settings" class="max-w-64">
      <ul>
        @for (link of top; track link) {
          <li>
            <a lgNavLink href="#" [attr.aria-current]="current() === link ? 'page' : null" (click)="go($event, link)">{{ link }}</a>
          </li>
        }
        <li>
          <details lgNavGroup open>
            <summary>Billing</summary>
            <ul>
              @for (link of billing; track link) {
                <li>
                  <a lgNavLink href="#" [attr.aria-current]="current() === link ? 'page' : null" (click)="go($event, link)">{{ link }}</a>
                </li>
              }
            </ul>
          </details>
        </li>
      </ul>
    </nav>
  `,
})
export class NavigationDemo {
  protected readonly top = ['Profile', 'Security', 'Notifications'];
  protected readonly billing = ['Plan', 'Invoices', 'Payment methods'];
  protected readonly current = signal('Profile');

  protected go(event: Event, link: string): void {
    event.preventDefault();
    this.current.set(link);
  }
}
