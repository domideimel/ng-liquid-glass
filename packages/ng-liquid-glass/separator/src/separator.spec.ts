import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgSeparator } from './separator';

describe('LgSeparator', () => {
  it('styles a horizontal <hr>', async () => {
    await render(`<p>Above</p><hr lgSeparator /><p>Below</p>`, { imports: [LgSeparator] });
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('border-t', 'w-full');
    expect(separator).not.toHaveAttribute('aria-orientation');
    await expectNoA11yViolations();
  });

  it('marks a vertical separator', async () => {
    await render(`<div style="display:flex"><span>A</span><hr lgSeparator orientation="vertical" /><span>B</span></div>`, {
      imports: [LgSeparator],
    });
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveClass('border-s', 'self-stretch');
    await expectNoA11yViolations();
  });
});
