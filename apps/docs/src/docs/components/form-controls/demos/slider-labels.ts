import { Component, computed, signal } from '@angular/core';
import { LgSlider } from '@domideimel/ng-liquid-glass/forms';

@Component({
  selector: 'docs-slider-labels-demo',
  imports: [LgSlider],
  template: `
    <div class="flex max-w-md flex-col gap-1">
      <label for="docs-swing" class="font-medium text-lg-fg">Swing</label>
      <input
        id="docs-swing"
        type="range"
        lgSlider
        min="0"
        max="100"
        [value]="swing()"
        [attr.aria-valuetext]="valueText()"
        (input)="swing.set(slider.valueAsNumber)"
        #slider
      />
      <div aria-hidden="true" class="flex justify-between text-sm">
        <span [class]="swing() < 50 ? 'font-semibold text-lg-fg' : 'text-lg-fg-muted'">Straight</span>
        <span [class]="swing() >= 50 ? 'font-semibold text-lg-fg' : 'text-lg-fg-muted'">Swing</span>
      </div>
    </div>
  `,
})
export class SliderLabelsDemo {
  protected readonly swing = signal(30);
  protected readonly valueText = computed(() => (this.swing() === 0 ? 'Straight' : `${String(this.swing())} % swing`));
}
