import { Component, signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { userEvent as nativeEvent } from 'vitest/browser';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgDialog, LgDialogClose, LgDialogDescription, LgDialogTitle } from './dialog';

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

@Component({
  imports: [LgDialog, LgDialogClose],
  template: `
    <main tabindex="-1" data-testid="main">
      <button type="button" (click)="open.set(true)">Open</button>
    </main>
    <button #other type="button">Other</button>
    <span>Plain text</span>
    <lg-dialog [(open)]="open" [returnFocus]="useOther() ? other : null">
      <button type="button" lgDialogClose>Close</button>
    </lg-dialog>
  `,
})
class FocusHost {
  readonly open = signal(false);
  readonly useOther = signal(false);
}

/** Clicks without moving focus, like a mouse click on a button in Safari. */
const safariClick = (element: Element) => {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

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

  it('closes on a backdrop click when dismissible, also without closedby support', async () => {
    const { fixture } = await render(Host);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const dialog = screen.getByRole('dialog');
    const box = dialog.getBoundingClientRect();
    const click = (x: number, y: number) => {
      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
    };
    // Not dismissible: a backdrop click does nothing.
    click(box.left - 10, box.top - 10);
    expect(fixture.componentInstance.open()).toBe(true);
    fixture.componentInstance.dismissible.set(true);
    fixture.detectChanges();
    // A click inside the dialog's own padding keeps it open.
    click(box.left + 2, box.top + 2);
    expect(fixture.componentInstance.open()).toBe(true);
    click(box.left - 10, box.top - 10);
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it.each([
    ['center', 'm-auto'],
    ['start', 'me-auto'],
    ['end', 'ms-auto'],
    ['bottom', 'mt-auto'],
    ['sheet', 'sm:m-auto'],
  ] as const)('places a %s dialog', async (placement, cls) => {
    await render(`<lg-dialog [placement]="placement" [open]="true"><h2 lgDialogTitle>Filters</h2></lg-dialog>`, {
      imports: [LgDialog, LgDialogTitle],
      componentProperties: { placement },
    });
    expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveClass(cls, 'lg-glass');
  });

  it('is an alert dialog with a description that ignores backdrop clicks', async () => {
    const { fixture } = await render(
      `
        <lg-dialog alert dismissible [(open)]="open">
          <h2 lgDialogTitle>Delete setlist?</h2>
          <p lgDialogDescription>Its 12 songs stay in your library.</p>
          <button type="button" lgDialogClose>Cancel</button>
        </lg-dialog>
      `,
      { imports: [LgDialog, LgDialogTitle, LgDialogDescription, LgDialogClose], componentProperties: { open: signal(true) } },
    );
    await fixture.whenStable();
    const dialog = screen.getByRole('alertdialog', { name: 'Delete setlist?' });
    expect(dialog).toHaveAccessibleDescription('Its 12 songs stay in your library.');
    expect(dialog).toHaveAttribute('closedby', 'closerequest');
    expect(document.querySelector('lg-dialog')).not.toHaveAttribute('role');
    const box = dialog.getBoundingClientRect();
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: box.left - 10, clientY: box.top - 10 }));
    expect(dialog).toHaveAttribute('open');
    await expectNoA11yViolations();
  });

  it('has no description reference without lgDialogDescription', async () => {
    const { fixture } = await render(Host);
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
  });

  it('emits closed however it closes, so @if can remove it', async () => {
    const shown = signal(true);
    const closed = vi.fn(() => {
      shown.set(false);
    });
    const { fixture } = await render(
      `@if (shown()) {
        <lg-dialog [open]="true" (closed)="closed()"><h2 lgDialogTitle>Tempo</h2><button type="button" lgDialogClose>Done</button></lg-dialog>
      }`,
      { imports: [LgDialog, LgDialogTitle, LgDialogClose], componentProperties: { shown, closed } },
    );
    await fixture.whenStable();
    expect(screen.getByRole('dialog', { name: 'Tempo' })).toHaveAttribute('open');
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    // The native close event is dispatched as a separate task.
    await expect.poll(() => closed.mock.calls.length).toBe(1);
    await fixture.whenStable();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  describe('returning focus', () => {
    async function openAndClose(open: () => void) {
      const view = await render(FocusHost);
      open();
      await view.fixture.whenStable();
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('open');
      safariClick(screen.getByRole('button', { name: 'Close' }));
      await vi.waitFor(() => {
        expect(dialog).not.toHaveAttribute('open');
      });
      await view.fixture.whenStable();
      return view;
    }

    it('focuses the clicked opener when the click did not focus it (Safari)', async () => {
      await openAndClose(() => {
        safariClick(screen.getByRole('button', { name: 'Open' }));
      });
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
      });
    });

    it('focuses the clicked opener when the click focused its container instead (Safari, skip-link targets)', async () => {
      await openAndClose(() => {
        screen.getByTestId('main').focus();
        safariClick(screen.getByRole('button', { name: 'Open' }));
      });
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
      });
    });

    it("keeps the browser's own restore when the opener was focused", async () => {
      await openAndClose(() => {
        screen.getByRole('button', { name: 'Open' }).focus();
        screen.getByRole('button', { name: 'Open' }).click();
      });
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
      });
    });

    it('uses returnFocus when given', async () => {
      const view = await render(FocusHost);
      view.fixture.componentInstance.useOther.set(true);
      screen.getByRole('button', { name: 'Open' }).focus();
      screen.getByRole('button', { name: 'Open' }).click();
      await view.fixture.whenStable();
      safariClick(screen.getByRole('button', { name: 'Close' }));
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Other' })).toHaveFocus();
      });
    });

    async function closeWithoutOpener(view: Awaited<ReturnType<typeof render<FocusHost>>>) {
      await view.fixture.whenStable();
      expect(screen.getByRole('dialog')).toHaveAttribute('open');
      safariClick(screen.getByRole('button', { name: 'Close' }));
      await vi.waitFor(() => {
        expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
      });
    }

    it('leaves focus alone when the last click was on nothing focusable', async () => {
      const view = await render(FocusHost);
      safariClick(screen.getByText('Plain text'));
      view.fixture.componentInstance.open.set(true);
      await closeWithoutOpener(view);
      expect(document.body).toHaveFocus();
    });

    it('ignores a click that is too old to have opened it', async () => {
      const view = await render(FocusHost);
      safariClick(screen.getByRole('button', { name: 'Other' }));
      const spy = vi.spyOn(performance, 'now').mockReturnValue(performance.now() + 5000);
      view.fixture.componentInstance.open.set(true);
      await view.fixture.whenStable();
      spy.mockRestore();
      expect(screen.getByRole('dialog')).toHaveAttribute('open');
      safariClick(screen.getByRole('button', { name: 'Close' }));
      await vi.waitFor(() => {
        expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
      });
      expect(screen.getByRole('button', { name: 'Other' })).not.toHaveFocus();
    });

    it('skips a disabled opener', async () => {
      const view = await render(FocusHost);
      const opener = screen.getByRole('button', { name: 'Open' });
      safariClick(opener);
      await view.fixture.whenStable();
      opener.toggleAttribute('disabled', true);
      safariClick(screen.getByRole('button', { name: 'Close' }));
      await vi.waitFor(() => {
        expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
      });
      expect(opener).not.toHaveFocus();
    });
  });
});
