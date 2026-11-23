import { render, screen } from '@testing-library/angular';

describe('test styles', () => {
  it('applies Tailwind and the theme in unit tests', async () => {
    await render(`<div class="hidden" data-testid="hidden">x</div><div class="size-11 bg-lg-primary" data-testid="box"></div>`);
    expect(screen.getByTestId('hidden')).not.toBeVisible();
    const box = screen.getByTestId('box').getBoundingClientRect();
    expect(Math.round(box.width)).toBe(44);
    expect(getComputedStyle(screen.getByTestId('box')).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
