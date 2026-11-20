import { Component, signal } from '@angular/core';
import { form, FormField, minLength } from '@angular/forms/signals';
import { LgFormField, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgTag } from './tag';
import { LgTagInput } from './tag-input';

describe('LgTag', () => {
  it('renders a plain tag without a button', async () => {
    await render(`<lg-tag>Draft</lg-tag>`, { imports: [LgTag] });
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
    await expectNoA11yViolations();
  });

  it('names the remove button after the tag and emits remove', async () => {
    const removed = vi.fn();
    await render(`<lg-tag removable (remove)="removed()">Angular</lg-tag>`, { imports: [LgTag], componentProperties: { removed } });
    const button = screen.getByRole('button', { name: 'Remove Angular' });
    expect(button).toHaveClass('size-11');
    await userEvent.click(button);
    expect(removed).toHaveBeenCalledTimes(1);
    await expectNoA11yViolations();
  });
});

@Component({
  imports: [FormField, LgTagInput, LgFormField, LgLabel],
  template: `
    <lg-form-field>
      <label lgLabel>Skills</label>
      <lg-tag-input placeholder="Add a skill" [formField]="profile.skills" />
    </lg-form-field>
  `,
})
class SkillsForm {
  readonly model = signal<{ skills: readonly string[] }>({ skills: ['Angular'] });
  readonly profile = form(this.model, (path) => {
    // `required` doesn't treat an empty array as missing; require at least one tag with minLength.
    minLength(path.skills, 1, { message: 'Add at least one skill' });
  });
}

async function setupInput() {
  const view = await render(SkillsForm);
  return { ...view, input: screen.getByRole('textbox', { name: /Skills/ }), model: view.fixture.componentInstance.model };
}

describe('LgTagInput', () => {
  it('is labelled by the form field and lists the tags', async () => {
    const { input } = await setupInput();
    expect(input).toHaveAttribute('placeholder', 'Add a skill');
    expect(screen.getByRole('list')).toHaveTextContent('Angular');
    await expectNoA11yViolations();
  });

  it('adds tags with Enter and comma, skips duplicates and announces them', async () => {
    const { input, model } = await setupInput();
    await userEvent.type(input, 'Signals{Enter}');
    await userEvent.type(input, 'RxJS,');
    await userEvent.type(input, 'Angular{Enter}');
    expect(model().skills).toEqual(['Angular', 'Signals', 'RxJS']);
    expect(input).toHaveValue('');
    expect(screen.getByText('RxJS added')).toBeInTheDocument();
    await userEvent.type(input, ',{Enter}');
    expect(model().skills).toHaveLength(3);
  });

  it('removes tags with their button and with Backspace, keeping focus in the input', async () => {
    const { input, model } = await setupInput();
    await userEvent.type(input, 'Signals{Enter}');
    await userEvent.click(screen.getByRole('button', { name: 'Remove Angular' }));
    expect(model().skills).toEqual(['Signals']);
    expect(input).toHaveFocus();
    expect(screen.getByText('Angular removed')).toBeInTheDocument();
    await userEvent.keyboard('{Backspace}');
    expect(model().skills).toEqual([]);
  });

  it('adds pending text on blur and shows the required error once touched', async () => {
    const { input, model, fixture } = await setupInput();
    await userEvent.click(screen.getByRole('button', { name: 'Remove Angular' }));
    await userEvent.tab();
    await userEvent.tab();
    fixture.detectChanges();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Add at least one skill')).toBeInTheDocument();
    await userEvent.type(input, 'Testing');
    await userEvent.tab();
    expect(model().skills).toEqual(['Testing']);
  });

  it('can be disabled', async () => {
    await render(`<label for="t">Tags</label><lg-tag-input disabled [value]="['A']" />`, { imports: [LgTagInput] });
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove A' })).toBeDisabled();
  });
});
