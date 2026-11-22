import { Component, signal } from '@angular/core';
import { LgCombobox } from '@domideimel/ng-liquid-glass/combobox';
import { LgFormField, LgLabel } from '@domideimel/ng-liquid-glass/forms';

interface Language {
  readonly code: string;
  readonly name: string;
}

@Component({
  selector: 'docs-combobox-demo',
  imports: [LgCombobox, LgFormField, LgLabel],
  template: `
    <lg-form-field class="max-w-sm">
      <label lgLabel>Language</label>
      <lg-combobox listLabel="Languages" placeholder="Start typing…" [options]="languages" [displayWith]="byName" [(value)]="language" />
    </lg-form-field>
    <p class="mt-4">Selected: {{ language()?.code ?? 'none' }}</p>
  `,
})
export class ComboboxDemo {
  protected readonly languages: Language[] = [
    { code: 'de', name: 'German' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
  ];
  protected readonly language = signal<Language | null>(null);
  protected readonly byName = (language: Language): string => language.name;
}
