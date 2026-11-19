import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgAlert } from './alert';

describe('LgAlert', () => {
  it.each([
    ['info', 'bg-lg-info-surface'],
    ['success', 'bg-lg-success-surface'],
    ['warning', 'bg-lg-warning-surface'],
    ['danger', 'bg-lg-danger-surface'],
  ] as const)('renders the %s status with text and a decorative icon', async (status, cls) => {
    await render(`<lg-alert role="status" [status]="status" heading="Heads up">Body text</lg-alert>`, {
      imports: [LgAlert],
      componentProperties: { status },
    });
    const alert = screen.getByRole('status');
    expect(alert).toHaveClass(cls);
    expect(alert).toHaveTextContent('Heads up');
    expect(alert.querySelector('lg-status-icon')).toHaveAttribute('aria-hidden', 'true');
    await expectNoA11yViolations();
  });

  it('omits the heading when empty', async () => {
    await render(`<lg-alert>Only body</lg-alert>`, { imports: [LgAlert] });
    expect(screen.getByText('Only body').closest('lg-alert')?.querySelector('p.font-semibold')).toBeNull();
  });
});
