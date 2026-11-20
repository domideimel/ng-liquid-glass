import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';
import { LgStepper } from '@domideimel/ng-liquid-glass/stepper';

@Component({
  selector: 'docs-stepper-demo',
  imports: [LgButton, LgCluster, LgStepper],
  template: `
    <lg-stepper label="Checkout" [steps]="steps" [current]="step()" />
    <div lgCluster class="mt-4">
      <button lgButton type="button" [disabled]="step() === 1" (click)="step.set(step() - 1)">Back</button>
      <button lgButton variant="primary" type="button" [disabled]="step() === steps.length" (click)="step.set(step() + 1)">Next</button>
    </div>
  `,
})
export class StepperDemo {
  protected readonly steps = ['Cart', 'Address', 'Payment', 'Review'];
  protected readonly step = signal(2);
}
