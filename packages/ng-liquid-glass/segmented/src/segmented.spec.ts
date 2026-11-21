import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgSegment, LgSegmented, LgToggle } from './segmented';

describe('LgSegmented', () => {
  it('is a native radio group with arrow-key selection', async () => {
    await render(
      `
        <fieldset lgSegmented>
          <legend>View</legend>
          <label lgSegment><input type="radio" name="view" value="list" checked /> List</label>
          <label lgSegment><input type="radio" name="view" value="grid" /> Grid</label>
          <label lgSegment><input type="radio" name="view" value="board" disabled /> Board</label>
        </fieldset>
      `,
      { imports: [LgSegmented, LgSegment] },
    );
    expect(screen.getByRole('group', { name: 'View' })).toBeInTheDocument();
    const list = screen.getByRole('radio', { name: 'List' });
    expect(list).toBeChecked();
    list.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked();
    expect(screen.getByText('Grid').closest('label')).toHaveClass('has-checked:bg-lg-surface');
    await expectNoA11yViolations();
  });
});

describe('LgToggle', () => {
  it('toggles aria-pressed and updates its model', async () => {
    const bold = signal(false);
    await render(`<button lgToggle [(pressed)]="bold">Bold</button>`, { imports: [LgToggle], componentProperties: { bold } });
    const button = screen.getByRole('button', { name: 'Bold' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(bold()).toBe(true);
    await userEvent.keyboard('{Enter}');
    expect(bold()).toBe(false);
    await expectNoA11yViolations();
  });
});
