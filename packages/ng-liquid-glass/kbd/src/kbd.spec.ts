import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgKbd } from './kbd';

describe('LgKbd', () => {
  it('styles keys and key combinations', async () => {
    await render(`<p>Press <kbd lgKbd data-testid="combo"><kbd lgKbd>Ctrl</kbd> + <kbd lgKbd>K</kbd></kbd> to search.</p>`, {
      imports: [LgKbd],
    });
    expect(screen.getByText('Ctrl')).toHaveClass('font-mono', 'rounded-md');
    expect(screen.getByTestId('combo').tagName).toBe('KBD');
    await expectNoA11yViolations();
  });
});
