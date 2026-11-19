import { render, screen } from '@testing-library/angular';
import { LgCard } from './card';

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
