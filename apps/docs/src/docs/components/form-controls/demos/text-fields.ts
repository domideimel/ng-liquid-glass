import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { LgFormField, LgHint, LgInput, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { LgStack } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-text-fields-demo',
  imports: [FormField, LgFormField, LgHint, LgInput, LgLabel, LgStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div lgStack gap="lg" class="max-w-md">
      <lg-form-field>
        <label lgLabel>Project name</label>
        <input lgInput [formField]="project.name" />
      </lg-form-field>
      <lg-form-field>
        <label lgLabel>Description</label>
        <lg-hint>Up to 200 characters.</lg-hint>
        <textarea lgInput rows="3" [formField]="project.description"></textarea>
      </lg-form-field>
      <lg-form-field>
        <label lgLabel>Visibility</label>
        <select lgInput [formField]="project.visibility">
          <option value="private">Private</option>
          <option value="internal">Internal</option>
          <option value="public">Public</option>
        </select>
      </lg-form-field>
    </div>
  `,
})
export class TextFieldsDemo {
  protected readonly project = form(signal({ name: '', description: '', visibility: 'private' }), (path) => {
    required(path.name, { message: 'Give your project a name' });
    maxLength(path.description, 200, { message: 'Keep it under 200 characters' });
  });
}
