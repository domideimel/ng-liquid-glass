import { Component, signal } from '@angular/core';
import { form, FormField, max, min, required } from '@angular/forms/signals';
import { LgFormField, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgNumberField } from './number-field';

@Component({
  imports: [FormField, LgFormField, LgLabel, LgNumberField],
  template: `
    <lg-form-field>
      <label lgLabel>Tempo</label>
      <lg-number-field step="1" largeStep="10" [valueText]="bpm" [formField]="settings.tempo" />
    </lg-form-field>
  `,
})
class TempoForm {
  readonly bpm = (value: number): string => `${String(value)} BPM`;
  readonly model = signal<{ tempo: number | null }>({ tempo: 120 });
  readonly settings = form(this.model, (path) => {
    required(path.tempo, { message: 'Set a tempo' });
    min(path.tempo, 20);
    max(path.tempo, 300);
  });
}

async function setup() {
  const view = await render(TempoForm);
  return { ...view, field: screen.getByRole('spinbutton', { name: 'Tempo' }), model: view.fixture.componentInstance.model };
}

describe('LgNumberField', () => {
  it('is a spinbutton with its range and value text', async () => {
    const { field } = await setup();
    expect(field).toHaveValue('120');
    expect(field).toHaveAttribute('aria-valuenow', '120');
    expect(field).toHaveAttribute('aria-valuemin', '20');
    expect(field).toHaveAttribute('aria-valuemax', '300');
    expect(field).toHaveAttribute('aria-valuetext', '120 BPM');
    expect(screen.getByRole('button', { name: 'Increase' })).toHaveAttribute('tabindex', '-1');
    await expectNoA11yViolations();
  });

  it('steps with the keyboard and clamps to the range', async () => {
    const { field, model } = await setup();
    field.focus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(model().tempo).toBe(122);
    await userEvent.keyboard('{ArrowDown}');
    expect(model().tempo).toBe(121);
    await userEvent.keyboard('{PageUp}');
    expect(model().tempo).toBe(131);
    await userEvent.keyboard('{PageDown}{PageDown}');
    expect(model().tempo).toBe(111);
    await userEvent.keyboard('{End}');
    expect(model().tempo).toBe(300);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    await userEvent.keyboard('{ArrowUp}');
    expect(model().tempo).toBe(300);
    await userEvent.keyboard('{Home}');
    expect(model().tempo).toBe(20);
    expect(field).toHaveAttribute('aria-valuetext', '20 BPM');
  });

  it('applies typed values on Enter and blur, clamped, and reverts invalid text', async () => {
    const { field, model } = await setup();
    await userEvent.clear(field);
    await userEvent.type(field, '96{Enter}');
    expect(model().tempo).toBe(96);
    await userEvent.clear(field);
    await userEvent.type(field, '999');
    await userEvent.tab();
    expect(model().tempo).toBe(300);
    expect(field).toHaveValue('300');
    await userEvent.clear(field);
    await userEvent.type(field, 'fast{Enter}');
    expect(field).toHaveValue('300');
    await userEvent.clear(field);
    await userEvent.type(field, '{Enter}');
    expect(model().tempo).toBeNull();
  });

  it('repeats while a button is held and stops on release', async () => {
    vi.useFakeTimers();
    try {
      const { field, model } = await setup();
      const increase = screen.getByRole('button', { name: 'Increase' });
      increase.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
      expect(model().tempo).toBe(121);
      expect(field).toHaveFocus();
      vi.advanceTimersByTime(400 + 75 * 3);
      expect(model().tempo).toBe(125);
      increase.dispatchEvent(new PointerEvent('pointerup'));
      vi.advanceTimersByTime(1000);
      expect(model().tempo).toBe(125);
      const decrease = screen.getByRole('button', { name: 'Decrease' });
      decrease.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 2 }));
      expect(model().tempo).toBe(125);
    } finally {
      vi.useRealTimers();
    }
  });

  it('rounds to the step and starts empty fields at min', async () => {
    const value = signal<number | null>(null);
    await render(`<label for="n">Gain</label><lg-number-field id="n" min="0" max="1" step="0.1" [(value)]="value" />`, {
      imports: [LgNumberField],
      componentProperties: { value },
    });
    const field = screen.getByRole('spinbutton');
    field.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(value()).toBe(0);
    await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(value()).toBe(0.3);
    await userEvent.clear(field);
    await userEvent.type(field, '0,5{Enter}');
    expect(value()).toBe(0.5);
  });

  it('shows the required error once touched', async () => {
    const { field, model, fixture } = await setup();
    await userEvent.clear(field);
    await userEvent.tab();
    fixture.detectChanges();
    expect(model().tempo).toBeNull();
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Set a tempo')).toBeInTheDocument();
  });

  it('can be disabled', async () => {
    await render(`<label for="d">Bars</label><lg-number-field id="d" disabled [value]="4" />`, { imports: [LgNumberField] });
    expect(screen.getByRole('spinbutton', { name: 'Bars' })).toBeDisabled();
    expect(document.querySelectorAll('#d')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });
});
