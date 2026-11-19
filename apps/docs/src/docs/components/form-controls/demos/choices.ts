import { Component, signal } from '@angular/core';
import { form, FormField, max, min } from '@angular/forms/signals';
import { LgCheckbox, LgChoice, LgFieldset, LgRadio, LgSlider, LgSwitch } from '@domideimel/ng-liquid-glass/forms';
import { LgStack } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-choices-demo',
  imports: [FormField, LgCheckbox, LgChoice, LgFieldset, LgRadio, LgSlider, LgSwitch, LgStack],
  template: `
    <div lgStack gap="lg" class="max-w-md">
      <label lgChoice><input type="checkbox" lgSwitch [formField]="settings.notifications" /> Email notifications</label>
      <label lgChoice><input type="checkbox" lgCheckbox [formField]="settings.newsletter" /> Subscribe to the newsletter</label>
      <fieldset lgFieldset>
        <legend>Plan</legend>
        <label lgChoice><input type="radio" lgRadio value="free" [formField]="settings.plan" /> Free</label>
        <label lgChoice><input type="radio" lgRadio value="pro" [formField]="settings.plan" /> Pro</label>
        <label lgChoice><input type="radio" lgRadio value="team" [formField]="settings.plan" /> Team</label>
      </fieldset>
      <div>
        <label for="volume" class="font-medium">Volume: {{ model().volume }}</label>
        <input id="volume" type="range" lgSlider [formField]="settings.volume" />
      </div>
    </div>
  `,
})
export class ChoicesDemo {
  protected readonly model = signal({ notifications: true, newsletter: false, plan: 'free', volume: 40 });
  protected readonly settings = form(this.model, (path) => {
    min(path.volume, 0);
    max(path.volume, 100);
  });
}
