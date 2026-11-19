import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgButton } from './button';

describe('LgButton', () => {
  it('renders a native button with the secondary variant by default', async () => {
    await render(`<button lgButton type="button">Save</button>`, { imports: [LgButton] });
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('min-h-11', 'min-w-11', 'border-lg-control-border');
    expect(button).not.toHaveAttribute('aria-busy');
    await expectNoA11yViolations();
  });

  it.each([
    ['primary', 'bg-lg-primary'],
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
});
