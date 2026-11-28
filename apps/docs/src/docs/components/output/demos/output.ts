import { Component, computed, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LgFormField, LgInput, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { LgOutput } from '@domideimel/ng-liquid-glass/output';

@Component({
  selector: 'docs-output-demo',
  imports: [FormField, LgFormField, LgInput, LgLabel, LgOutput],
  template: `
    <div class="flex max-w-xl flex-col gap-4">
      <lg-form-field>
        <label lgLabel>Text</label>
        <textarea lgInput id="output-source" rows="3" [formField]="source.text"></textarea>
      </lg-form-field>
      <div class="flex flex-col gap-1.5">
        <span id="base64-label" class="font-medium text-lg-fg">Base64</span>
        <output lgOutput mono for="output-source" aria-labelledby="base64-label">{{ encoded() }}</output>
      </div>
      <pre lgOutput aria-label="As YAML">{{ yaml() }}</pre>
    </div>
  `,
})
export class OutputDemo {
  protected readonly source = form(signal({ text: 'Liquid glass, accessible by default.\nSecond line.' }));
  protected readonly encoded = computed(() => btoa(String.fromCodePoint(...new TextEncoder().encode(this.source.text().value()))));
  protected readonly yaml = computed(() => `text: |\n${this.source.text().value().replace(/^/gm, '  ')}`);
}
