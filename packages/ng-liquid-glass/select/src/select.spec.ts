import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { LgFormField, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgSelect } from './select';

interface Plan {
  id: string;
  name: string;
  price: string;
}
const PLANS: Plan[] = [
  { id: 'free', name: 'Free', price: '0 € per month' },
  { id: 'pro', name: 'Pro', price: '12 € per month' },
  { id: 'team', name: 'Team', price: '40 € per month' },
  { id: 'enterprise', name: 'Enterprise', price: 'Contact us' },
];

@Component({
  imports: [FormField, LgFormField, LgLabel, LgSelect],
  template: `
    <lg-form-field>
      <label lgLabel>Plan</label>
      <lg-select placeholder="Choose a plan" [options]="plans" [displayWith]="byName" [describeWith]="byPrice" [formField]="account.plan" />
    </lg-form-field>
    <button type="button">After</button>
  `,
})
class PlanPicker {
  readonly plans = PLANS;
  readonly byName = (plan: Plan): string => plan.name;
  readonly byPrice = (plan: Plan): string => plan.price;
  readonly model = signal<{ plan: Plan | null }>({ plan: null });
  readonly account = form(this.model, (path) => {
    required(path.plan, { message: 'Choose a plan' });
  });
}

async function setup() {
  const view = await render(PlanPicker);
  const select = screen.getByRole('combobox', { name: 'Plan' });
  return { ...view, select, model: view.fixture.componentInstance.model };
}

const option = (name: RegExp) => screen.getByRole('option', { name });

describe('LgSelect', () => {
  it('is a collapsed combobox showing the placeholder', async () => {
    const { select } = await setup();
    expect(select.tagName).toBe('BUTTON');
    expect(select).toHaveAttribute('aria-expanded', 'false');
    expect(select).toHaveTextContent('Choose a plan');
    await expectNoA11yViolations();
  });

  it('opens with the keyboard, moves the active option and selects with Enter', async () => {
    const { select, model } = await setup();
    select.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(select).toHaveAttribute('aria-expanded', 'true');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Free/).id);
    expect(option(/Pro/)).toHaveTextContent('12 € per month');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Team/).id);
    await userEvent.keyboard('{Enter}');
    expect(model().plan?.id).toBe('team');
    expect(select).toHaveAttribute('aria-expanded', 'false');
    expect(select).toHaveTextContent('Team');
    expect(select).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(option(/Team/)).toHaveAttribute('aria-selected', 'true');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Team/).id);
    await expectNoA11yViolations();
  });

  it('supports Home, End, Escape and stays within the list', async () => {
    const { select, model } = await setup();
    select.focus();
    await userEvent.keyboard('{End}');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Enterprise/).id);
    await userEvent.keyboard('{ArrowDown}');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Enterprise/).id);
    await userEvent.keyboard('{Home}{ArrowUp}');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Free/).id);
    await userEvent.keyboard('{End}{Home}');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Free/).id);
    await userEvent.keyboard('{Escape}');
    expect(select).toHaveAttribute('aria-expanded', 'false');
    expect(model().plan).toBeNull();
    await userEvent.keyboard('{ArrowUp}');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Enterprise/).id);
    await userEvent.keyboard(' ');
    expect(model().plan?.id).toBe('enterprise');
  });

  it('jumps to options by typing', async () => {
    const { select } = await setup();
    select.focus();
    await userEvent.keyboard('t');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Team/).id);
    await userEvent.keyboard('{Escape}');
    await userEvent.keyboard('en');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Enterprise/).id);
    await userEvent.keyboard('x');
    expect(select).toHaveAttribute('aria-activedescendant', option(/Enterprise/).id);
  });

  it('selects with a click and closes on Tab', async () => {
    const { select, model } = await setup();
    await userEvent.click(select);
    await userEvent.click(option(/Pro/));
    expect(model().plan?.id).toBe('pro');
    await userEvent.click(select);
    expect(select).toHaveAttribute('aria-activedescendant', option(/Pro/).id);
    await userEvent.click(select);
    expect(select).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(select);
    await userEvent.tab();
    expect(select).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('shows the required error once touched', async () => {
    const { select, fixture } = await setup();
    select.focus();
    await userEvent.tab();
    fixture.detectChanges();
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Choose a plan', { selector: 'p' })).toBeInTheDocument();
  });

  it('can be disabled and ignores keys without options', async () => {
    await render(`<lg-select aria-label="Empty" [options]="[]" /><lg-select disabled [options]="['A']" />`, { imports: [LgSelect] });
    const [empty, disabled] = screen.getAllByRole('combobox');
    empty?.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(empty).toHaveAttribute('aria-expanded', 'false');
    expect(disabled).toBeDisabled();
  });
});
