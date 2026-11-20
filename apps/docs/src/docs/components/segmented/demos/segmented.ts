import { Component, signal } from '@angular/core';
import { LgSegment, LgSegmented } from '@domideimel/ng-liquid-glass/segmented';

@Component({
  selector: 'docs-segmented-demo',
  imports: [LgSegment, LgSegmented],
  template: `
    <fieldset lgSegmented>
      <legend>View</legend>
      @for (option of options; track option) {
        <label lgSegment>
          <input type="radio" name="docs-view" [value]="option" [checked]="view() === option" (change)="view.set(option)" />
          {{ option }}
        </label>
      }
    </fieldset>
    <p class="mt-3 mb-0">Showing: {{ view() }}</p>
  `,
})
export class SegmentedDemo {
  protected readonly options = ['List', 'Grid', 'Board'];
  protected readonly view = signal('List');
}
