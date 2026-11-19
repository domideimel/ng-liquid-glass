import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgTab, LgTabPanel, LgTabs } from './tabs';

async function setup(initial = '') {
  const value = signal(initial);
  await render(
    `
      <lg-tabs label="Settings" [(value)]="value">
        <button lgTab value="profile">Profile</button>
        <button lgTab value="security">Security</button>
        <button lgTab value="billing" disabled>Billing</button>
        <button lgTab value="team">Team</button>
        <div lgTabPanel value="profile">Profile panel</div>
        <div lgTabPanel value="security">Security panel</div>
        <div lgTabPanel value="billing">Billing panel</div>
        <div lgTabPanel value="team">Team panel</div>
      </lg-tabs>
    `,
    { imports: [LgTabs, LgTab, LgTabPanel], componentProperties: { value } },
  );
  return { value, tab: (name: string) => screen.getByRole('tab', { name }) };
}

describe('LgTabs', () => {
  it('selects the first tab by default and links tabs to panels', async () => {
    const { tab } = await setup();
    expect(screen.getByRole('tablist', { name: 'Settings' })).toBeInTheDocument();
    expect(tab('Profile')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Profile')).toHaveAttribute('tabindex', '0');
    expect(tab('Security')).toHaveAttribute('tabindex', '-1');
    const panel = screen.getByRole('tabpanel', { name: 'Profile' });
    expect(tab('Profile')).toHaveAttribute('aria-controls', panel.id);
    expect(screen.getByText('Security panel')).not.toBeVisible();
    await expectNoA11yViolations();
  });

  it('activates tabs with arrows, Home and End, skipping disabled tabs', async () => {
    const { tab, value } = await setup('security');
    tab('Security').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Team')).toHaveFocus();
    expect(value()).toBe('team');
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Profile')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(tab('Team')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(value()).toBe('profile');
    await userEvent.keyboard('{End}');
    expect(value()).toBe('team');
    await userEvent.keyboard('x');
    expect(value()).toBe('team');
    expect(screen.getByText('Team panel')).toBeVisible();
  });

  it('selects on click', async () => {
    const { tab, value } = await setup();
    await userEvent.click(tab('Security'));
    expect(value()).toBe('security');
  });
});
