import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgCard, LgCardActions, LgCardHeader } from './card';

describe('LgCard', () => {
  it('renders a solid or glass surface', async () => {
    await render(`<article lgCard aria-label="Solid">a</article><article lgCard glass aria-label="Glass">b</article>`, {
      imports: [LgCard],
    });
    expect(screen.getByRole('article', { name: 'Solid' })).toHaveClass('border', 'bg-lg-surface');
    expect(screen.getByRole('article', { name: 'Glass' })).toHaveClass('lg-glass');
    expect(screen.getByRole('article', { name: 'Glass' })).not.toHaveClass('border');
  });
});

describe('LgCardHeader', () => {
  it('puts the heading and the actions on one centred row', async () => {
    await render(
      `<section lgCard aria-labelledby="t">
        <header lgCardHeader data-testid="header">
          <h2 id="t">Result</h2>
          <div lgCardActions data-testid="actions"><button type="button" class="size-11">Copy</button></div>
        </header>
      </section>`,
      { imports: [LgCard, LgCardHeader, LgCardActions] },
    );
    const header = screen.getByTestId('header');
    expect(getComputedStyle(header).alignItems).toBe('center');
    expect(getComputedStyle(screen.getByRole('heading', { name: 'Result' })).marginTop).toBe('0px');
    const heading = screen.getByRole('heading').getBoundingClientRect();
    const actions = screen.getByTestId('actions').getBoundingClientRect();
    expect(actions.left).toBeGreaterThan(heading.right);
    expect(Math.abs(heading.top + heading.height / 2 - (actions.top + actions.height / 2))).toBeLessThan(1);
    await expectNoA11yViolations();
  });
});
