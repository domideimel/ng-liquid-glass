import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCluster, LgStack } from '@domideimel/ng-liquid-glass/layout';
import { LgNumberField } from '@domideimel/ng-liquid-glass/number-field';
import { LgSegment, LgSegmented, LgToggle } from '@domideimel/ng-liquid-glass/segmented';

@Component({
  selector: 'docs-density-demo',
  imports: [LgButton, LgCluster, LgNumberField, LgSegment, LgSegmented, LgStack, LgToggle],
  template: `
    <button lgToggle type="button" [(pressed)]="compact">Compact density</button>
    <div lgStack class="mt-4" [attr.data-density]="compact() ? 'compact' : null">
      <fieldset lgSegmented>
        <legend>Subdivision</legend>
        @for (note of notes; track note) {
          <label lgSegment>
            <input
              type="radio"
              name="docs-subdivision"
              [value]="note"
              [checked]="note === subdivision()"
              (change)="subdivision.set(note)"
            />
            {{ note }}
          </label>
        }
      </fieldset>
      <div lgCluster>
        <button lgButton size="sm" type="button">−5</button>
        <label class="sr-only" for="docs-density-bars">Bars</label>
        <lg-number-field id="docs-density-bars" min="1" max="16" [value]="4" />
        <button lgButton size="sm" type="button">+5</button>
        <button lgButton variant="primary" type="button">Start</button>
      </div>
    </div>
  `,
})
export class DensityDemo {
  protected readonly compact = signal(false);
  protected readonly notes = ['1/4', '1/8', '1/8T', '1/16', '1/16T', '1/32'];
  protected readonly subdivision = signal('1/8');
}
