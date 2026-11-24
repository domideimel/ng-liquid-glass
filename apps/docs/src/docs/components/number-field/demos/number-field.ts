import { Component, signal } from '@angular/core';
import { form, FormField, max, min, required } from '@angular/forms/signals';
import { LgFormField, LgHint, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { LgNumberField } from '@domideimel/ng-liquid-glass/number-field';

@Component({
  selector: 'docs-number-field-demo',
  imports: [FormField, LgFormField, LgHint, LgLabel, LgNumberField],
  template: `
    <lg-form-field>
      <label lgLabel>Tempo</label>
      <lg-hint>20 to 300 BPM. Page Up and Page Down step by 10.</lg-hint>
      <lg-number-field [valueText]="bpm" [formField]="metronome.tempo" />
    </lg-form-field>
  `,
})
export class NumberFieldDemo {
  protected readonly bpm = (value: number): string => `${String(value)} BPM`;
  protected readonly metronome = form(signal<{ tempo: number | null }>({ tempo: 120 }), (path) => {
    required(path.tempo, { message: 'Set a tempo' });
    min(path.tempo, 20);
    max(path.tempo, 300);
  });
}
