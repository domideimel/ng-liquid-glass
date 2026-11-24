import { Component, computed, signal } from '@angular/core';
import { LgSlider } from '@domideimel/ng-liquid-glass/forms';

/** A tuner gauge drawn with SVG and themed only with lg-* tokens. */
@Component({
  selector: 'docs-custom-control-demo',
  imports: [LgSlider],
  template: `
    <figure class="m-0 flex max-w-xs flex-col items-center gap-2">
      <svg viewBox="0 0 200 110" class="w-full" role="img" [attr.aria-label]="label()">
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" class="stroke-lg-border" stroke-width="10" stroke-linecap="round" />
        <path d="M92 22 A80 80 0 0 1 108 22" fill="none" class="stroke-lg-success" stroke-width="10" stroke-linecap="round" />
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          class="stroke-lg-fg"
          stroke-width="4"
          stroke-linecap="round"
          [attr.transform]="'rotate(' + cents() * 1.6 + ' 100 100)'"
        />
        <circle cx="100" cy="100" r="7" class="fill-lg-fg" />
      </svg>
      <figcaption class="text-lg-display-sm font-semibold tabular-nums text-lg-fg">{{ cents() > 0 ? '+' : '' }}{{ cents() }} ¢</figcaption>
      <label for="docs-cents" class="sr-only">Detune (demo input)</label>
      <input id="docs-cents" type="range" lgSlider min="-50" max="50" [value]="cents()" (input)="cents.set(range.valueAsNumber)" #range />
    </figure>
  `,
})
export class CustomControlDemo {
  protected readonly cents = signal(-12);
  protected readonly label = computed(() => {
    const cents = this.cents();
    return cents === 0 ? 'In tune' : `${String(Math.abs(cents))} cents ${cents < 0 ? 'flat' : 'sharp'}`;
  });
}
