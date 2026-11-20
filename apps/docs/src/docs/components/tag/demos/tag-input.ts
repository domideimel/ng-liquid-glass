import { Component, signal } from '@angular/core';
import { form, FormField, minLength } from '@angular/forms/signals';
import { LgFormField, LgHint, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { LgTagInput } from '@domideimel/ng-liquid-glass/tag';

@Component({
  selector: 'docs-tag-input-demo',
  imports: [FormField, LgFormField, LgHint, LgLabel, LgTagInput],
  template: `
    <lg-form-field>
      <label lgLabel>Skills</label>
      <lg-hint>Press Enter or comma after each skill.</lg-hint>
      <lg-tag-input placeholder="Add a skill" [formField]="profile.skills" />
    </lg-form-field>
  `,
})
export class TagInputDemo {
  protected readonly profile = form(signal<{ skills: readonly string[] }>({ skills: ['Angular', 'Accessibility'] }), (path) => {
    minLength(path.skills, 1, { message: 'Add at least one skill' });
  });
}
