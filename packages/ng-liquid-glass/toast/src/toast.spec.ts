import { TestBed } from '@angular/core/testing';
import { provideLgI18n } from '@domideimel/ng-liquid-glass';
import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgToaster, LgToasterRegion } from './toast';

async function setup() {
  const view = await render(LgToasterRegion, { providers: [provideLgI18n({ notifications: 'Benachrichtigungen' })] });
  return { ...view, toaster: TestBed.inject(LgToaster) };
}

describe('LgToaster', () => {
  it('renders polite toasts in a status region and errors in an alert region', async () => {
    const { toaster, fixture } = await setup();
    toaster.show({ message: 'Saved', status: 'success' });
    toaster.show({ message: 'Upload failed', status: 'danger' });
    fixture.detectChanges();
    expect(screen.getByRole('region', { name: 'Benachrichtigungen' })).toBeInTheDocument();
    expect(within(screen.getByRole('status')).getByText('Saved')).toBeInTheDocument();
    expect(within(screen.getByRole('alert')).getByText('Upload failed')).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it('stays until dismissed by default', async () => {
    const { toaster, fixture } = await setup();
    toaster.show({ message: 'Hello' });
    fixture.detectChanges();
    expect(toaster.toasts()[0]?.status).toBe('info');
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(toaster.toasts()).toEqual([]);
  });

  it('runs an action and dismisses the toast', async () => {
    const { toaster, fixture } = await setup();
    const run = vi.fn();
    toaster.show({ message: 'Deleted', action: { label: 'Undo', run } });
    fixture.detectChanges();
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(run).toHaveBeenCalledOnce();
    expect(toaster.toasts()).toEqual([]);
  });

  it('expires after its duration and keeps the remaining time while paused', () => {
    vi.useFakeTimers();
    try {
      const toaster = TestBed.inject(LgToaster);
      const id = toaster.show({ message: 'Copied', duration: 3000 });
      vi.advanceTimersByTime(1000);
      toaster.pause('hover');
      vi.advanceTimersByTime(10_000);
      expect(toaster.toasts().map((t) => t.id)).toEqual([id]);
      toaster.resume('hover');
      vi.advanceTimersByTime(1999);
      expect(toaster.toasts().map((t) => t.id)).toEqual([id]);
      vi.advanceTimersByTime(1);
      expect(toaster.toasts()).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('stays paused until every reason to pause has ended, and starts new toasts paused', () => {
    vi.useFakeTimers();
    try {
      const toaster = TestBed.inject(LgToaster);
      toaster.pause('hover');
      toaster.pause('focus');
      const id = toaster.show({ message: 'Saved', duration: 500 });
      toaster.resume('hover');
      vi.advanceTimersByTime(1000);
      expect(toaster.toasts().map((t) => t.id)).toEqual([id]);
      toaster.resume('focus');
      vi.advanceTimersByTime(500);
      expect(toaster.toasts()).toEqual([]);
      toaster.dismiss(id);
    } finally {
      vi.useRealTimers();
    }
  });

  it('pauses while hovered or focused', async () => {
    const { toaster, fixture } = await setup();
    toaster.show({ message: 'Hi', action: { label: 'Undo', run: () => undefined } });
    fixture.detectChanges();
    const region = screen.getByRole('region');
    region.dispatchEvent(new PointerEvent('pointerenter'));
    expect(toaster.paused()).toBe(true);
    region.dispatchEvent(new PointerEvent('pointerleave'));
    expect(toaster.paused()).toBe(false);
    const [undo, dismiss] = screen.getAllByRole('button');
    region.dispatchEvent(new FocusEvent('focusin'));
    expect(toaster.paused()).toBe(true);
    // Moving focus between toast buttons stays paused; leaving the region resumes.
    undo?.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: dismiss ?? null }));
    expect(toaster.paused()).toBe(true);
    region.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    expect(toaster.paused()).toBe(false);
  });
});
