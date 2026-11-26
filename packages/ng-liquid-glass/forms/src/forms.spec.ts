import { Component, signal } from '@angular/core';
import { email, form, FormField, max, min, required } from '@angular/forms/signals';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgCheckbox, LgInput, LgRadio, LgSlider, LgSwitch } from './control';
import { LgError, LgFormField, LgHint, LgLabel } from './form-field';
import { LgChoice, LgFieldset } from './layout';

@Component({
  imports: [FormField, LgFormField, LgLabel, LgHint, LgError, LgInput],
  template: `
    <lg-form-field>
      <label lgLabel>Email</label>
      @if (showHint()) {
        <lg-hint>We never share it.</lg-hint>
      }
      <input lgInput type="email" [formField]="profile.email" />
      <lg-error>Use your work address.</lg-error>
    </lg-form-field>
  `,
})
class EmailField {
  readonly showHint = signal(true);
  readonly profile = form(signal({ email: '' }), (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email' });
  });
}

describe('lg-form-field', () => {
  it('connects label, hint and control', async () => {
    await render(EmailField);
    const input = screen.getByRole('textbox', { name: /Email/ });
    const hint = screen.getByText('We never share it.');
    expect(input).toHaveAttribute('aria-describedby', hint.id);
    expect(input).toBeRequired();
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    await expectNoA11yViolations();
  });

  it('shows Signal Forms errors once the field is touched', async () => {
    await render(EmailField);
    const input = screen.getByRole('textbox', { name: /Email/ });
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();

    await userEvent.click(input);
    await userEvent.tab();

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Email is required')).toBeVisible();
    expect(screen.getByText('Use your work address.')).toBeVisible();
    expect(input.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(input).toHaveAccessibleDescription(/We never share it\..*Email is required/);

    await userEvent.type(input, 'not-an-email');
    expect(screen.getByText('Enter a valid email')).toBeVisible();
    await userEvent.clear(input);
    await userEvent.type(input, 'ada@example.com');
    expect(input).not.toHaveAttribute('aria-invalid');
    await expectNoA11yViolations();
  });

  it('unregisters a removed hint', async () => {
    const { fixture } = await render(EmailField);
    fixture.componentInstance.showHint.set(false);
    fixture.detectChanges();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('keeps an explicit id and works without a form field', async () => {
    await render(`<label for="name">Name</label><input lgInput id="name" />`, { imports: [LgInput] });
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('id', 'name');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('styles textareas and selects', async () => {
    await render(
      `<lg-form-field><label lgLabel>Bio</label><textarea lgInput></textarea></lg-form-field>
       <lg-form-field><label lgLabel>Size</label><select lgInput><option>S</option></select></lg-form-field>`,
      { imports: [LgFormField, LgLabel, LgInput] },
    );
    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveClass('min-h-lg-control');
    expect(screen.getByRole('combobox', { name: 'Size' })).toHaveClass('min-h-lg-control');
    await expectNoA11yViolations();
  });

  it('draws single selects itself so they keep their height, and leaves list boxes native', async () => {
    await render(
      `<label for="one">One</label><select lgInput id="one"><option>S</option></select>
       <label for="many">Many</label><select lgInput id="many" multiple><option>S</option></select>`,
      { imports: [LgInput] },
    );
    const single = screen.getByRole('combobox', { name: 'One' });
    expect(getComputedStyle(single).appearance).toBe('none');
    expect(getComputedStyle(single).backgroundImage).toContain('linear-gradient');
    // The arrow's room beats lgInput's px-3, so long option text doesn't run under it.
    expect(getComputedStyle(single).paddingInlineEnd).toBe('36px');
    expect(Math.round(single.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    expect(getComputedStyle(screen.getByRole('listbox', { name: 'Many' })).appearance).not.toBe('none');
  });
});

@Component({
  imports: [FormField, LgCheckbox, LgRadio, LgSwitch, LgSlider, LgChoice, LgFieldset],
  template: `
    <label lgChoice><input type="checkbox" lgCheckbox [formField]="prefs.terms" /> Accept terms</label>
    <label lgChoice><input type="checkbox" lgSwitch [formField]="prefs.dark" /> Dark mode</label>
    <fieldset lgFieldset>
      <legend>Plan</legend>
      <label lgChoice><input type="radio" lgRadio value="free" [formField]="prefs.plan" /> Free</label>
      <label lgChoice><input type="radio" lgRadio value="pro" [formField]="prefs.plan" /> Pro</label>
    </fieldset>
    <label for="volume">Volume</label>
    <input id="volume" type="range" lgSlider [formField]="prefs.volume" />
  `,
})
class Preferences {
  readonly model = signal({ terms: false, dark: true, plan: 'free', volume: 5 });
  readonly prefs = form(this.model, (path) => {
    min(path.volume, 0);
    max(path.volume, 10);
  });
}

describe('choice controls', () => {
  it('binds checkbox, switch, radios and slider to Signal Forms', async () => {
    const { fixture } = await render(Preferences);
    const model = fixture.componentInstance.model;
    const toggle = screen.getByRole('switch', { name: 'Dark mode' });
    expect(toggle).toBeChecked();

    await userEvent.click(screen.getByRole('checkbox', { name: 'Accept terms' }));
    await userEvent.click(toggle);
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));

    expect(model()).toMatchObject({ terms: true, dark: false, plan: 'pro' });
    expect(screen.getByRole('group', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveValue('5');
    await expectNoA11yViolations();
  });
});
