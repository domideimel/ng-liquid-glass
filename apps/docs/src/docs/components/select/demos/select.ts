import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { LgFormField, LgHint, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { LgSelect } from '@domideimel/ng-liquid-glass/select';

interface Plan {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'docs-select-demo',
  imports: [FormField, LgFormField, LgHint, LgLabel, LgSelect],
  template: `
    <lg-form-field class="max-w-sm">
      <label lgLabel>Plan</label>
      <lg-hint>You can change it any time.</lg-hint>
      <lg-select
        placeholder="Choose a plan"
        [options]="plans"
        [displayWith]="name"
        [describeWith]="description"
        [formField]="account.plan"
      />
    </lg-form-field>
  `,
})
export class SelectDemo {
  protected readonly plans: Plan[] = [
    { id: 'free', name: 'Free', description: '1 project, community support' },
    { id: 'pro', name: 'Pro', description: '12 € per month, unlimited projects' },
    { id: 'team', name: 'Team', description: '40 € per month, shared workspaces' },
  ];
  protected readonly name = (plan: Plan): string => plan.name;
  protected readonly description = (plan: Plan): string => plan.description;
  protected readonly account = form(signal<{ plan: Plan | null }>({ plan: null }), (path) => {
    required(path.plan, { message: 'Choose a plan' });
  });
}
