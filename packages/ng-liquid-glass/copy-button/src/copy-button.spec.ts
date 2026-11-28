import { provideLgI18n } from '@domideimel/ng-liquid-glass';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgCopyButton } from './copy-button';

describe('LgCopyButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  async function setup(
    template = `<lg-copy-button value="abc123" label="Copy hash" (copied)="copied($event)" (copyFailed)="failed($event)" />`,
  ) {
    const copied = vi.fn();
    const failed = vi.fn();
    const view = await render(template, { imports: [LgCopyButton], componentProperties: { copied, failed } });
    return { ...view, copied, failed };
  }

  it('copies the value, confirms with a check mark and announces it', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    const { copied, fixture } = await setup();
    const button = screen.getByRole('button', { name: 'Copy hash' });
    expect(button).toHaveClass('rounded-full');
    const iconBefore = button.querySelector('svg')?.innerHTML;
    await userEvent.click(button);
    await fixture.whenStable();
    expect(writeText).toHaveBeenCalledWith('abc123');
    expect(copied).toHaveBeenCalledWith('abc123');
    expect(screen.getByText('Copied')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Copied')).toHaveClass('sr-only');
    expect(button.querySelector('svg')?.innerHTML).not.toBe(iconBefore);
    // The name stays stable; the live region carries the confirmation.
    expect(button).toHaveAccessibleName('Copy hash');
    await expectNoA11yViolations();
  });

  it('goes back to the copy icon after a moment, and announces a repeated copy again', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { fixture } = await setup(`<lg-copy-button value="x" showLabel />`);
    const button = screen.getByRole('button', { name: 'Copy' });
    button.click();
    await fixture.whenStable();
    expect(button).toHaveTextContent('Copied');
    button.click();
    await fixture.whenStable();
    // A repeated message gets a no-break space, so screen readers announce it again.
    expect((fixture.nativeElement as HTMLElement).querySelector('[aria-live]')?.textContent).toBe('Copied\u00A0');
    vi.advanceTimersByTime(2000);
    await fixture.whenStable();
    expect(button).toHaveTextContent('Copy');
    expect(button).not.toHaveClass('rounded-full');
    fixture.destroy();
  });

  it('shows and announces a fallback message when copying is refused', async () => {
    const reason = new DOMException('denied', 'NotAllowedError');
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(reason);
    const { failed, copied, fixture } = await setup();
    await userEvent.click(screen.getByRole('button', { name: 'Copy hash' }));
    await fixture.whenStable();
    const message = screen.getByText("Couldn't copy. Select the text and copy it yourself.");
    expect(message).toBeVisible();
    expect(message).toHaveClass('text-lg-danger');
    expect(failed).toHaveBeenCalledWith(reason);
    expect(copied).not.toHaveBeenCalled();
  });

  it('falls back where the Clipboard API is missing, and uses translated texts', async () => {
    vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue(undefined as unknown as Clipboard);
    const failed = vi.fn();
    const { fixture } = await render(`<lg-copy-button value="x" (copyFailed)="failed($event)" />`, {
      imports: [LgCopyButton],
      providers: [provideLgI18n({ copy: 'Kopieren', copyFailed: 'Nicht möglich' })],
      componentProperties: { failed },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Kopieren' }));
    await fixture.whenStable();
    expect(screen.getByText('Nicht möglich')).toBeVisible();
    expect(failed).toHaveBeenCalledOnce();
  });
});
