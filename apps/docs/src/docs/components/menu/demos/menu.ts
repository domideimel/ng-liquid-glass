import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgMenu, LgMenuItem, LgMenuTrigger } from '@domideimel/ng-liquid-glass/menu';

@Component({
  selector: 'docs-menu-demo',
  imports: [LgButton, LgMenu, LgMenuItem, LgMenuTrigger],
  template: `
    <button lgButton type="button" [lgMenuTrigger]="menu">Actions</button>
    <lg-menu #menu>
      <button lgMenuItem type="button" (click)="last.set('Edit')">Edit</button>
      <button lgMenuItem type="button" (click)="last.set('Duplicate')">Duplicate</button>
      <button lgMenuItem type="button" disabled>Move (no permission)</button>
      <button lgMenuItem type="button" class="text-lg-danger" (click)="last.set('Delete')">Delete</button>
    </lg-menu>
    <p class="mt-4" aria-live="polite">Last action: {{ last() }}</p>
  `,
})
export class MenuDemo {
  protected readonly last = signal('none');
}
