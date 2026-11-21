import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LgFileInput } from '@domideimel/ng-liquid-glass/file-input';
import { LgFormField, LgHint, LgLabel } from '@domideimel/ng-liquid-glass/forms';

@Component({
  selector: 'docs-file-input-demo',
  imports: [FormField, LgFileInput, LgFormField, LgHint, LgLabel],
  template: `
    <lg-form-field class="max-w-md">
      <label lgLabel>Attachments</label>
      <lg-hint>PDFs and images.</lg-hint>
      <lg-file-input multiple accept=".pdf,image/*" [formField]="message.attachments" />
    </lg-form-field>
  `,
})
export class FileInputDemo {
  protected readonly message = form(signal<{ attachments: readonly File[] }>({ attachments: [] }));
}
