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

  it('expires after its duration, but not while paused', () => {
    vi.useFakeTimers();
    try {
      const toaster = TestBed.inject(LgToaster);
      const id = toaster.show({ message: 'Copied', duration: 3000 });
      toaster.paused.set(true);
      vi.advanceTimersByTime(3000);
      expect(toaster.toasts().map((t) => t.id)).toEqual([id]);
      toaster.paused.set(false);
      vi.advanceTimersByTime(1000);
      expect(toaster.toasts()).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('pauses while hovered or focused', async () => {
    const { toaster, fixture } = await setup();
    toaster.show({ message: 'Hi' });
    fixture.detectChanges();
    const region = screen.getByRole('region');
    region.dispatchEvent(new PointerEvent('pointerenter'));
    expect(toaster.paused()).toBe(true);
    region.dispatchEvent(new PointerEvent('pointerleave'));
    expect(toaster.paused()).toBe(false);
    region.dispatchEvent(new FocusEvent('focusin'));
    expect(toaster.paused()).toBe(true);
    region.dispatchEvent(new FocusEvent('focusout'));
    expect(toaster.paused()).toBe(false);
  });
});
