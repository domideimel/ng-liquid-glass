import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgBreadcrumbs } from './breadcrumbs';

describe('LgBreadcrumbs', () => {
  it('labels the navigation and keeps the current page marked', async () => {
    await render(
      `<nav lgBreadcrumbs><ol><li><a href="/">Home</a></li><li><a href="/settings" aria-current="page">Settings</a></li></ol></nav>
       <nav lgBreadcrumbs label="Pfad"><ol><li><a href="/">Start</a></li></ol></nav>`,
      { imports: [LgBreadcrumbs] },
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Pfad' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    await expectNoA11yViolations();
  });
});
