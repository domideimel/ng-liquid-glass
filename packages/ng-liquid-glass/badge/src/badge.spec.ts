import { render, screen } from '@testing-library/angular';
import { LgBadge } from './badge';

describe('LgBadge', () => {
  it.each([
    ['neutral', 'bg-lg-surface-muted'],
    ['info', 'text-lg-info'],
    ['success', 'text-lg-success'],
    ['warning', 'text-lg-warning'],
    ['danger', 'text-lg-danger'],
  ] as const)('renders the %s variant', async (variant, cls) => {
    await render(`<span lgBadge [variant]="variant">Paid</span>`, { imports: [LgBadge], componentProperties: { variant } });
    expect(screen.getByText('Paid')).toHaveClass(cls, 'rounded-full');
  });
});
