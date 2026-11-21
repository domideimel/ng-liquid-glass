import { render, screen } from '@testing-library/angular';
import { provideLgI18n } from '@domideimel/ng-liquid-glass';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgLink } from './link';

describe('LgLink', () => {
  it('styles an internal link without extra text', async () => {
    await render(`<p>Read the <a lgLink href="/terms">terms</a>.</p>`, { imports: [LgLink] });
    const link = screen.getByRole('link', { name: 'terms' });
    expect(link).toHaveClass('underline', 'lg-focus-ring');
    expect(link.querySelector('svg')).toBeNull();
    await expectNoA11yViolations();
  });

  it('announces that an external link opens a new tab', async () => {
    await render(`<a lgLink href="https://angular.dev" target="_blank" rel="noopener">Angular</a>`, {
      imports: [LgLink],
      providers: [provideLgI18n({ opensInNewTab: 'neuer Tab' })],
    });
    expect(screen.getByRole('link', { name: 'Angular (neuer Tab)' })).toHaveAttribute('target', '_blank');
    await expectNoA11yViolations();
  });
});
