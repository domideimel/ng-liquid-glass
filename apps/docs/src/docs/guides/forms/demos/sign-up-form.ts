import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCombobox } from '@domideimel/ng-liquid-glass/combobox';
import { LgCheckbox, LgChoice, LgFormField, LgHint, LgInput, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { LgToaster } from '@domideimel/ng-liquid-glass/toast';

@Component({
  selector: 'docs-sign-up-form',
  imports: [FormField, LgButton, LgCheckbox, LgChoice, LgCombobox, LgFormField, LgHint, LgInput, LgLabel],
  template: `
    <form class="flex max-w-md flex-col gap-5" novalidate (submit)="onSubmit($event)">
      <lg-form-field>
        <label lgLabel>Name</label>
        <input lgInput autocomplete="name" [formField]="signUp.name" />
      </lg-form-field>
      <lg-form-field>
        <label lgLabel>Email</label>
        <lg-hint>We send a confirmation link.</lg-hint>
        <input lgInput type="email" autocomplete="email" [formField]="signUp.email" />
      </lg-form-field>
      <lg-form-field>
        <label lgLabel>Country</label>
        <lg-combobox listLabel="Countries" [options]="countries" [formField]="signUp.country" />
      </lg-form-field>
      <label lgChoice><input type="checkbox" lgCheckbox [formField]="signUp.terms" /> I accept the terms</label>
      <button lgButton variant="primary" type="submit">Create account</button>
    </form>
  `,
})
export class SignUpFormDemo {
  private readonly toaster = inject(LgToaster);
  protected readonly countries = ['Austria', 'Belgium', 'Denmark', 'France', 'Germany', 'Italy', 'Netherlands', 'Switzerland'];
  protected readonly model = signal({ name: '', email: '', country: null as string | null, terms: false });
  protected readonly signUp = form(this.model, (path) => {
    required(path.name, { message: 'Enter your name' });
    minLength(path.name, 2, { message: 'Use at least 2 characters' });
    required(path.email, { message: 'Enter your email address' });
    email(path.email, { message: 'Enter an email address like name@example.com' });
    required(path.country, { message: 'Choose your country' });
    required(path.terms, { message: 'Accept the terms to continue' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    void submit(this.signUp, () => {
      this.toaster.show({ message: `Welcome, ${this.model().name}!`, status: 'success' });
      return Promise.resolve(undefined);
    });
  }
}
