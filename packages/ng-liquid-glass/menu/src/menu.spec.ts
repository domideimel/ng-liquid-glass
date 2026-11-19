import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgMenu, LgMenuItem, LgMenuTrigger } from './menu';

async function setup() {
  const edit = vi.fn();
  await render(
    `
      <button type="button" [lgMenuTrigger]="menu">Options</button>
      <lg-menu #menu>
        <button lgMenuItem (click)="edit()">Edit</button>
        <button lgMenuItem>Duplicate</button>
        <button lgMenuItem disabled>Archive</button>
        <button lgMenuItem>Delete</button>
      </lg-menu>
      <button type="button">After</button>
    `,
    { imports: [LgMenu, LgMenuItem, LgMenuTrigger], componentProperties: { edit } },
  );
  const trigger = screen.getByRole('button', { name: 'Options' });
  return { trigger, edit, item: (name: string) => screen.getByRole('menuitem', { name }) };
}

describe('LgMenu', () => {
  it('opens from the trigger, focuses the first item and is labelled by the trigger', async () => {
    const { trigger, item } = await setup();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu', { name: 'Options' })).toBeVisible();
    expect(item('Edit')).toHaveFocus();
    await expectNoA11yViolations();
  });

  it('moves focus with arrows, Home, End and type-ahead, skipping disabled items', async () => {
    const { trigger, item } = await setup();
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(item('Delete')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(item('Edit')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(item('Delete')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(item('Duplicate')).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(item('Delete')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(item('Edit')).toHaveFocus();
    await userEvent.keyboard('d');
    expect(item('Duplicate')).toHaveFocus();
    await userEvent.keyboard('d');
    expect(item('Delete')).toHaveFocus();
    await userEvent.keyboard('{Control>}e{/Control}');
    expect(item('Delete')).toHaveFocus();
  });

  it('runs the item action, closes and returns focus to the trigger', async () => {
    const { trigger, edit } = await setup();
    await userEvent.click(trigger);
    await userEvent.keyboard('{Enter}');
    expect(edit).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('closes with Escape, Tab or a second click', async () => {
    const { trigger } = await setup();
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.tab();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
