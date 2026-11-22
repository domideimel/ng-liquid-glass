import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { LgFormField, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { lgContains, LgCombobox } from './combobox';

interface Country {
  code: string;
  name: string;
}
const COUNTRIES: Country[] = [
  { code: 'at', name: 'Austria' },
  { code: 'de', name: 'Germany' },
  { code: 'dk', name: 'Denmark' },
];

@Component({
  imports: [FormField, LgCombobox, LgFormField, LgLabel],
  template: `
    <lg-form-field>
      <label lgLabel>Country</label>
      <lg-combobox listLabel="Countries" [options]="countries" [displayWith]="byName" [formField]="address.country" />
    </lg-form-field>
  `,
})
class CountryPicker {
  readonly countries = COUNTRIES;
  readonly byName = (country: Country): string => country.name;
  readonly model = signal<{ country: Country | null }>({ country: null });
  readonly address = form(this.model, (path) => {
    required(path.country, { message: 'Choose a country' });
  });
}

async function setup() {
  const view = await render(CountryPicker);
  const input = screen.getByRole('combobox', { name: /Country/ });
  return { ...view, input, model: view.fixture.componentInstance.model };
}

describe('lgContains', () => {
  it('matches case-insensitively and ignores surrounding spaces', () => {
    expect(lgContains('Germany', ' ger ')).toBe(true);
    expect(lgContains('Germany', 'x')).toBe(false);
  });
});

describe('LgCombobox', () => {
  it('follows the ARIA combobox pattern', async () => {
    const { input } = await setup();
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox', { hidden: true }).id);
    await expectNoA11yViolations();
  });

  it('filters, navigates with arrows and selects with Enter', async () => {
    const { input, model } = await setup();
    await userEvent.type(input, 'n');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option').map((o) => o.textContent.trim())).toEqual(['Germany', 'Denmark']);

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    const denmark = screen.getByRole('option', { name: 'Denmark' });
    expect(input).toHaveAttribute('aria-activedescendant', denmark.id);
    expect(denmark).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(input).toHaveAttribute('aria-activedescendant', denmark.id);

    await userEvent.keyboard('{Enter}');
    expect(model().country).toEqual(COUNTRIES[2]);
    expect(input).toHaveValue('Denmark');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await expectNoA11yViolations();
  });

  it('opens with ArrowUp on the last option and selects by click', async () => {
    const { input, model } = await setup();
    await userEvent.click(input);
    await userEvent.keyboard('{Escape}{ArrowUp}');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Denmark' }).id);
    await userEvent.click(screen.getByRole('option', { name: 'Austria' }));
    expect(model().country?.code).toBe('at');
    expect(input).toHaveFocus();
  });

  it('opens with Alt+ArrowDown without moving the active option', async () => {
    const { input } = await setup();
    input.focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{Enter}');
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes with Escape, then clears with a second Escape', async () => {
    const { input, model } = await setup();
    await userEvent.type(input, 'Aus{ArrowDown}{Enter}');
    expect(model().country?.name).toBe('Austria');
    await userEvent.keyboard('{ArrowDown}{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('');
    expect(model().country).toBeNull();
  });

  it('clears the selection when the text is edited and reverts on blur', async () => {
    const { input, model } = await setup();
    await userEvent.type(input, 'Ger{ArrowDown}{Enter}');
    await userEvent.type(input, 'x');
    expect(model().country).toBeNull();
    await userEvent.tab();
    expect(input).toHaveValue('');
  });

  it('announces the number of results and "No results"', async () => {
    const { input } = await setup();
    await userEvent.type(input, 'n');
    expect(screen.getByText('2 results available')).toBeInTheDocument();
    await userEvent.type(input, 'zz');
    expect(screen.getAllByText('No results')).toHaveLength(2);
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks the field touched on blur and shows the required error', async () => {
    const { input } = await setup();
    await userEvent.click(input);
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Choose a country')).toBeVisible();
    expect(input).toHaveAccessibleDescription('Choose a country');
  });

  it('lets you search remotely with [filter]="null"', async () => {
    const search = vi.fn();
    await render(
      `<label for="c">City</label><lg-combobox id="c" listLabel="Cities" [options]="results" [filter]="null" [loading]="loading" (query)="search($event)" />`,
      { imports: [LgCombobox], componentProperties: { results: ['Berlin', 'Bern'], loading: true, search } },
    );
    const input = screen.getAllByRole('combobox')[0];
    if (!input) throw new Error('combobox missing');
    await userEvent.type(input, 'zzz');
    expect(search).toHaveBeenLastCalledWith('zzz');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByText('Loading').length).toBeGreaterThan(0);
  });

  it('does not open when disabled and supports focus()', async () => {
    const { fixture } = await render(`<lg-combobox listLabel="Fruit" [options]="['Apple']" disabled />`, { imports: [LgCombobox] });
    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();
    const combobox = fixture.debugElement.children[0]?.componentInstance as LgCombobox<string>;
    combobox.focus();
    await userEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('stays open while the list itself is clicked or scrolled', async () => {
    const { input } = await setup();
    await userEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox');
    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    listbox.dispatchEvent(press);
    expect(press.defaultPrevented).toBe(true);
    // Dragging an overlay scrollbar focuses the scrolling popup in some browsers.
    input.dispatchEvent(new FocusEvent('blur', { relatedTarget: listbox }));
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveFocus();
    input.dispatchEvent(new FocusEvent('blur', { relatedTarget: null }));
    await new Promise((resolve) => setTimeout(resolve));
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});
