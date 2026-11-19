import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgAccordionItem } from './accordion';

describe('LgAccordionItem', () => {
  it('uses native details with exclusive groups', async () => {
    await render(
      `<details lgAccordionItem name="faq"><summary>Shipping</summary><p>2 days</p></details>
       <details lgAccordionItem name="faq"><summary>Returns</summary><p>30 days</p></details>`,
      { imports: [LgAccordionItem] },
    );
    const [shipping, returns] = screen.getAllByRole('group');
    await userEvent.click(screen.getByText('Shipping'));
    expect(shipping).toHaveAttribute('open');
    await userEvent.click(screen.getByText('Returns'));
    expect(returns).toHaveAttribute('open');
    expect(shipping).not.toHaveAttribute('open');
    await expectNoA11yViolations();
  });
});
