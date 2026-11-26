import { signal } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { userEvent as nativeEvent } from 'vitest/browser';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgPopover, LgPopoverTrigger } from './popover';

async function setup() {
  await render(
    `
      <button [lgPopoverTrigger]="filters">Filters</button>
      <lg-popover #filters label="Filters">
        <label for="status">Status</label>
        <select id="status"><option>Open</option></select>
        <button type="button" (click)="filters.close()">Apply</button>
      </lg-popover>
    `,
    { imports: [LgPopover, LgPopoverTrigger] },
  );
  return { trigger: screen.getByRole('button', { name: 'Filters' }) };
}

describe('LgPopover', () => {
  it('opens next to its trigger, moves focus in and exposes its state', async () => {
    const { trigger } = await setup();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Filters' });
    expect(dialog).toHaveAttribute('popover', 'auto');
    expect(dialog.matches(':popover-open')).toBe(true);
    // The browser fires the popover's toggle event asynchronously.
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveFocus();
    expect(dialog.style.getPropertyValue('position-anchor')).toBe(trigger.style.getPropertyValue('anchor-name'));
    await expectNoA11yViolations();
  });

  it('closes with Escape, with close(), and toggles from the trigger', async () => {
    const { trigger } = await setup();
    const expanded = (value: string) =>
      waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', value);
      });
    await userEvent.click(trigger);
    await expanded('true');
    // A real key press: synthetic Escape events don't trigger the popover's light dismiss.
    await nativeEvent.keyboard('{Escape}');
    await expanded('false');
    expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    await expanded('true');
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await expanded('false');

    await userEvent.click(trigger);
    await expanded('true');
    await userEvent.click(trigger);
    await expanded('false');
  });

  it('focuses the popover itself when it has nothing focusable', async () => {
    await render(`<button [lgPopoverTrigger]="info">Info</button><lg-popover #info label="About">Version 1.0</lg-popover>`, {
      imports: [LgPopover, LgPopoverTrigger],
    });
    await userEvent.click(screen.getByRole('button', { name: 'Info' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'About' })).toHaveFocus();
    });
  });

  it('opens and closes through the open model', async () => {
    const open = signal(false);
    await render(
      `<button [lgPopoverTrigger]="info">Info</button><lg-popover #info label="About" [(open)]="open">Version 1.0</lg-popover>`,
      {
        imports: [LgPopover, LgPopoverTrigger],
        componentProperties: { open },
      },
    );
    const trigger = screen.getByRole('button', { name: 'Info' });
    const dialog = document.querySelector<HTMLElement>('lg-popover')!;
    open.set(true);
    await waitFor(() => {
      expect(dialog.matches(':popover-open')).toBe(true);
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(dialog.style.getPropertyValue('position-anchor')).toBe(trigger.style.getPropertyValue('anchor-name'));
    open.set(false);
    await waitFor(() => {
      expect(dialog.matches(':popover-open')).toBe(false);
    });
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(open()).toBe(true);
    });
  });

  it('returns focus to a trigger that the click did not focus (Safari)', async () => {
    const { trigger } = await setup();
    // A synthetic click doesn't move focus, like a mouse click in Safari: <body> stays focused.
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Status' })).toHaveFocus();
    });
    await nativeEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('returns focus to the trigger when the click focused its container instead (Safari)', async () => {
    await render(
      `<main tabindex="-1" data-testid="main"><button [lgPopoverTrigger]="info">Info</button></main>
       <lg-popover #info label="About"><button type="button">Details</button></lg-popover>`,
      { imports: [LgPopover, LgPopoverTrigger] },
    );
    const trigger = screen.getByRole('button', { name: 'Info' });
    screen.getByTestId('main').focus();
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Details' })).toHaveFocus();
    });
    await nativeEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('leaves focus alone when it had already left the popover, or the trigger is disabled', async () => {
    const { trigger } = await setup();
    const dialog = document.querySelector<HTMLElement>('lg-popover')!;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitFor(() => {
      expect(dialog.matches(':popover-open')).toBe(true);
    });
    // Focus on the page, e.g. after a click on an empty area: closing doesn't pull it back.
    (document.activeElement as HTMLElement).blur();
    dialog.hidePopover();
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
    expect(document.body).toHaveFocus();

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Status' })).toHaveFocus();
    });
    trigger.toggleAttribute('disabled', true);
    await nativeEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
    expect(trigger).not.toHaveFocus();
  });
});
