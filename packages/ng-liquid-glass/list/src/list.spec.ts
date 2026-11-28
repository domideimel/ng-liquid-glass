import { Component, signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgInlineUndo } from './inline-undo';
import { LgList, LgListActions, LgListItem } from './list';

@Component({
  imports: [LgList, LgListItem, LgListActions, LgInlineUndo],
  template: `
    <ul lgList aria-label="Passwords">
      @for (item of items(); track item.id) {
        <li lgListItem>
          @if (item.removed) {
            <lg-inline-undo [message]="item.label + ' removed'" (undo)="toggle(item.id)" />
          } @else {
            <code>{{ item.label }}</code>
            <div lgListActions>
              <button type="button" class="size-11" [attr.aria-label]="'Remove ' + item.label" (click)="toggle(item.id)">×</button>
            </div>
          }
        </li>
      }
    </ul>
  `,
})
class Passwords {
  readonly items = signal([
    { id: 1, label: 'Password 1', removed: false },
    { id: 2, label: 'Password 2', removed: false },
  ]);

  toggle(id: number): void {
    this.items.update((items) => items.map((item) => (item.id === id ? { ...item, removed: !item.removed } : item)));
  }
}

describe('LgList', () => {
  it('is a named list with divided rows, content at the start and actions at the end', async () => {
    await render(Passwords);
    const list = screen.getByRole('list', { name: 'Passwords' });
    expect(list).toHaveClass('divide-y', 'border');
    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(getComputedStyle(rows[0]!).borderBottomWidth).toBe('1px');
    expect(getComputedStyle(rows[1]!).borderBottomWidth).toBe('0px');
    const code = screen.getByText('Password 1').getBoundingClientRect();
    const action = screen.getByRole('button', { name: 'Remove Password 1' }).getBoundingClientRect();
    expect(action.left).toBeGreaterThan(code.right);
    expect(Math.round(action.right)).toBe(Math.round(rows[0]!.getBoundingClientRect().right - 16));
    await expectNoA11yViolations();
  });
});

describe('LgInlineUndo', () => {
  it('replaces a removed row, focuses Undo with the message as description, and restores the row', async () => {
    const user = userEvent.setup();
    const { fixture } = await render(Passwords);
    await user.click(screen.getByRole('button', { name: 'Remove Password 2' }));
    await fixture.whenStable();
    const undo = screen.getByRole('button', { name: 'Undo' });
    expect(undo).toHaveFocus();
    expect(undo).toHaveAccessibleDescription('Password 2 removed');
    expect(screen.getByText('Password 2 removed')).toBeVisible();
    await expectNoA11yViolations();

    await user.keyboard('{Enter}');
    await fixture.whenStable();
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove Password 2' })).toBeInTheDocument();
  });
});
