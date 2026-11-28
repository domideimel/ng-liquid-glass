import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LgCard } from '@domideimel/ng-liquid-glass/card';
import { LgFileDrop, LgFileInput } from '@domideimel/ng-liquid-glass/file-input';
import { LgFormField, LgHint, LgInput, LgLabel } from '@domideimel/ng-liquid-glass/forms';

@Component({
  selector: 'docs-file-drop-demo',
  imports: [FormField, LgCard, LgFileDrop, LgFileInput, LgFormField, LgHint, LgInput, LgLabel],
  template: `
    <section
      lgCard
      aria-label="Document"
      class="flex max-w-xl flex-col gap-4"
      lgFileDropAccept=".txt,.json,.md,text/*"
      lgFileDropSingle
      (lgFileDrop)="load($event)"
      (lgFileDropRejected)="status.set('Only text files can be opened.')"
    >
      <lg-form-field>
        <label lgLabel>Text</label>
        <lg-hint>Paste text, or drop a text file anywhere on this card.</lg-hint>
        <textarea lgInput rows="5" [formField]="doc.text"></textarea>
      </lg-form-field>
      <lg-form-field>
        <label lgLabel>Open a file</label>
        <lg-file-input accept=".txt,.json,.md,text/*" (valueChange)="load($event)" />
      </lg-form-field>
      <p class="m-0 text-sm text-lg-fg-muted" aria-live="polite">{{ status() }}</p>
    </section>
  `,
})
export class FileDropDemo {
  protected readonly doc = form(signal({ text: '' }));
  protected readonly status = signal('');

  protected async load(files: readonly File[]): Promise<void> {
    const file = files[0];
    if (!file) return;
    this.doc.text().value.set(await file.text());
    this.status.set(`Loaded ${file.name}.`);
  }
}
