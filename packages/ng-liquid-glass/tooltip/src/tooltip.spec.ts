import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgTooltip } from './tooltip';

async function setup() {
  const text = signal('Copy to clipboard');
  const view = await render(`<button type="button" aria-label="Copy" [lgTooltip]="text()">⧉</button>`, {
    imports: [LgTooltip],
    componentProperties: { text },
  });
  const button = screen.getByRole('button', { name: 'Copy' });
  const tooltip = () => screen.getByRole('tooltip', { hidden: true });
  return { ...view, button, tooltip, text };
}

describe('LgTooltip', () => {
  it('describes its host and shows on focus', async () => {
    const { button, tooltip } = await setup();
    expect(button).toHaveAttribute('aria-describedby', tooltip().id);
    expect(tooltip()).not.toBeVisible();
    button.focus();
    expect(tooltip()).toBeVisible();
    expect(button).toHaveAccessibleDescription('Copy to clipboard');
    await expectNoA11yViolations();
    button.blur();
    expect(tooltip()).not.toBeVisible();
  });

  it('shows on hover, stays while hovering the tooltip and hides on Escape', async () => {
    const { button, tooltip } = await setup();
    await userEvent.hover(button);
    expect(tooltip()).toBeVisible();
    await userEvent.unhover(button);
    await userEvent.hover(tooltip());
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(tooltip()).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(tooltip()).not.toBeVisible();
  });

  it('hides after leaving the host and follows text changes', async () => {
    const { button, tooltip, text, fixture } = await setup();
    await userEvent.hover(button);
    await userEvent.unhover(button);
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(tooltip()).not.toBeVisible();
    text.set('Copied');
    fixture.detectChanges();
    expect(tooltip()).toHaveTextContent('Copied');
    fixture.destroy();
    expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
  });
});
