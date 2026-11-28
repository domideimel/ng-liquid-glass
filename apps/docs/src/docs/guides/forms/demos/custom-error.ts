import { Component, computed, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LgFormField, LgHint, LgInput, LgLabel } from '@domideimel/ng-liquid-glass/forms';

@Component({
  selector: 'docs-custom-error-demo',
  imports: [FormField, LgFormField, LgHint, LgInput, LgLabel],
  template: `
    <lg-form-field class="max-w-md" [error]="error()">
      <label lgLabel>Hex colour</label>
      <lg-hint>Six digits, e.g. #1d4ed8.</lg-hint>
      <input lgInput autocomplete="off" spellcheck="false" [formField]="colour.hex" />
    </lg-form-field>
  `,
})
export class CustomErrorDemo {
  protected readonly colour = form(signal({ hex: '#1d4ed8x' }));
  /** A parse error, not a validator: shown at once and wired to the input. */
  protected readonly error = computed(() => (/^#?[0-9a-f]{6}$/i.test(this.colour.hex().value()) ? null : "This isn't a valid hex colour."));
}
