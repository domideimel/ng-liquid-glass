import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgButton } from './button';

describe('LgButton', () => {
  it('renders a native button with the secondary variant by default', async () => {
    await render(`<button lgButton type="button">Save</button>`, { imports: [LgButton] });
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('min-h-lg-control', 'min-w-lg-control', 'border-lg-control-border');
    expect(button).not.toHaveAttribute('aria-busy');
    await expectNoA11yViolations();
  });

  it.each([
    ['primary', 'bg-lg-primary'],
    ['accent', 'bg-lg-accent'],
    ['ghost', 'bg-transparent'],
    ['danger', 'bg-lg-danger'],
  ])('applies the %s variant', async (variant, cls) => {
    await render(`<button lgButton type="button" [variant]="variant">Go</button>`, {
      imports: [LgButton],
      componentProperties: { variant },
    });
    expect(screen.getByRole('button')).toHaveClass(cls);
  });

  it('works on links', async () => {
    await render(`<a lgButton href="/docs" variant="primary">Docs</a>`, { imports: [LgButton] });
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass('bg-lg-primary');
  });

  it('keeps focus but blocks activation while loading', async () => {
    const onClick = vi.fn();
    await render(`<button lgButton type="button" loading (click)="onClick()">Save</button>`, {
      imports: [LgButton],
      componentProperties: { onClick },
    });
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    button.focus();
    expect(button).toHaveFocus();
  });

  it.each([
    ['sm', 32],
    ['md', 44],
    ['lg', 56],
    ['xl', 80],
  ] as const)('draws size %s %i px tall with a pointer target of at least 44 px', async (size, height) => {
    await render(`<button lgButton type="button" [size]="size">Go</button>`, { imports: [LgButton], componentProperties: { size } });
    const button = screen.getByRole('button', { name: 'Go' });
    expect(Math.round(button.getBoundingClientRect().height)).toBe(height);
    const hit = getComputedStyle(button, '::before');
    const target = hit.content === 'none' ? button.getBoundingClientRect().height : parseFloat(hit.height);
    expect(Math.round(target)).toBeGreaterThanOrEqual(44);
  });

  it('draws a round, square icon button and warns without an accessible name', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await render(
      `
        <button lgButton type="button" shape="circle" size="xl" aria-label="Play"><svg aria-hidden="true"></svg></button>
        <button lgButton type="button" shape="circle"><svg aria-hidden="true"></svg></button>
      `,
      { imports: [LgButton] },
    );
    const play = screen.getByRole('button', { name: 'Play' });
    const { width, height } = play.getBoundingClientRect();
    expect([Math.round(width), Math.round(height)]).toEqual([96, 96]);
    expect(getComputedStyle(play).borderRadius).not.toBe('0px');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain('needs an accessible name');
    warn.mockRestore();
  });

  it('shrinks in compact density but keeps 24 px targets (WCAG 2.5.8)', async () => {
    await render(
      `<div data-density="compact"><button lgButton type="button">Medium</button><button lgButton type="button" size="sm">Small</button></div>`,
      { imports: [LgButton] },
    );
    const medium = screen.getByRole('button', { name: 'Medium' });
    const small = screen.getByRole('button', { name: 'Small' });
    expect(Math.round(medium.getBoundingClientRect().height)).toBe(32);
    expect(Math.round(small.getBoundingClientRect().height)).toBe(24);
    expect(Math.round(parseFloat(getComputedStyle(small, '::before').height))).toBeGreaterThanOrEqual(24);
  });
});
