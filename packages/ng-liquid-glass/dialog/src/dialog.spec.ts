import { Component, signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { userEvent as nativeEvent } from 'vitest/browser';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgDialog, LgDialogClose, LgDialogTitle } from './dialog';

@Component({
  imports: [LgDialog, LgDialogTitle, LgDialogClose],
  template: `
    <button type="button" (click)="open.set(true)">Delete</button>
    <lg-dialog [(open)]="open" [dismissible]="dismissible()">
      <h2 lgDialogTitle>Delete project?</h2>
      <p>This cannot be undone.</p>
      <button type="button" lgDialogClose>Cancel</button>
    </lg-dialog>
  `,
})
class Host {
  readonly open = signal(false);
  readonly dismissible = signal(false);
}

describe('LgDialog', () => {
  it('opens as a modal named by its title and closes from the close button', async () => {
    const { fixture } = await render(Host);
    const opener = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(opener);
    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAttribute('closedby', 'closerequest');
    expect(dialog.matches(':modal')).toBe(true);
    await expectNoA11yViolations();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(fixture.componentInstance.open()).toBe(false);
    expect(dialog).not.toHaveAttribute('open');
    expect(opener).toHaveFocus();
  });

  it('syncs the model when the browser closes it with Escape', async () => {
    const { fixture } = await render(Host);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    // A trusted key press: browsers only close dialogs on real user input.
    await nativeEvent.keyboard('{Escape}');
    await vi.waitFor(() => {
      expect(fixture.componentInstance.open()).toBe(false);
    });
  });

  it('allows light dismiss when dismissible', async () => {
    const { fixture } = await render(Host);
    fixture.componentInstance.dismissible.set(true);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    expect(screen.getByRole('dialog')).toHaveAttribute('closedby', 'any');
  });
});
