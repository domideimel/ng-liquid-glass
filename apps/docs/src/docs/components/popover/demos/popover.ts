import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCheckbox, LgChoice, LgFieldset } from '@domideimel/ng-liquid-glass/forms';
import { LgPopover, LgPopoverTrigger } from '@domideimel/ng-liquid-glass/popover';

@Component({
  selector: 'docs-popover-demo',
  imports: [LgButton, LgCheckbox, LgChoice, LgFieldset, LgPopover, LgPopoverTrigger],
  template: `
    <button lgButton type="button" [lgPopoverTrigger]="filters">Filters ({{ selected().length }})</button>
    <lg-popover #filters aria-labelledby="docs-filters-title">
      <fieldset lgFieldset>
        <legend id="docs-filters-title">Status</legend>
        @for (status of statuses; track status) {
          <label lgChoice
            ><input type="checkbox" lgCheckbox [checked]="selected().includes(status)" (change)="toggle(status)" /> {{ status }}</label
          >
        }
      </fieldset>
      <button lgButton variant="primary" type="button" class="mt-3" (click)="filters.close()">Apply</button>
    </lg-popover>
  `,
})
export class PopoverDemo {
  protected readonly statuses = ['Open', 'In review', 'Done'];
  protected readonly selected = signal(['Open']);

  protected toggle(status: string): void {
    this.selected.update((selected) => (selected.includes(status) ? selected.filter((s) => s !== status) : [...selected, status]));
  }
}
