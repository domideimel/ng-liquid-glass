import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgNav, LgNavGroup, LgNavLink } from './navigation';

describe('LgNav', () => {
  it('renders links with the current page and collapsible groups', async () => {
    await render(
      `
        <nav lgNav aria-label="Settings">
          <ul>
            <li><a lgNavLink href="#profile" aria-current="page">Profile</a></li>
            <li>
              <details lgNavGroup>
                <summary>Billing</summary>
                <ul>
                  <li><a lgNavLink href="#invoices">Invoices</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </nav>
      `,
      { imports: [LgNav, LgNavGroup, LgNavLink] },
    );
    expect(screen.getByRole('navigation', { name: 'Settings' })).toHaveClass('block');
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page');
    const group = screen.getByText('Billing').closest('details');
    expect(group).not.toHaveAttribute('open');
    await userEvent.click(screen.getByText('Billing'));
    expect(group).toHaveAttribute('open');
    expect(screen.getByRole('link', { name: 'Invoices' })).toBeVisible();
    await expectNoA11yViolations();
  });
});
