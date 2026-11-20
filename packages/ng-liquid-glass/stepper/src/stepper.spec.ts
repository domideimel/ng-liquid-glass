import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgStepper } from './stepper';

describe('LgStepper', () => {
  it('marks completed steps and the current step', async () => {
    await render(`<lg-stepper label="Checkout" [steps]="['Cart', 'Address', 'Payment', 'Review']" current="3" />`, {
      imports: [LgStepper],
    });
    expect(screen.getByRole('navigation', { name: 'Checkout' })).toBeInTheDocument();
    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(4);
    expect(steps[0]).toHaveTextContent('Cart (completed)');
    expect(steps[1]).toHaveTextContent('Address (completed)');
    expect(steps[2]).toHaveAttribute('aria-current', 'step');
    expect(steps[2]).not.toHaveTextContent('completed');
    expect(steps[3]).not.toHaveAttribute('aria-current');
    await expectNoA11yViolations();
  });
});
