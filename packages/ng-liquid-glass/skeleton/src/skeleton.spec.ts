import { render, screen } from '@testing-library/angular';
import { LgSkeleton } from './skeleton';

describe('LgSkeleton', () => {
  it('is hidden from assistive technology', async () => {
    await render(`<div aria-busy="true" data-testid="region"><lg-skeleton /><div lgSkeleton></div></div>`, { imports: [LgSkeleton] });
    const shapes = screen.getByTestId('region').children;
    expect(shapes).toHaveLength(2);
    for (const shape of shapes) expect(shape).toHaveAttribute('aria-hidden', 'true');
  });
});
