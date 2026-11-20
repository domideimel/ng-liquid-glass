import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgToolbar } from './toolbar';

async function setup(orientation = 'horizontal') {
  await render(
    `
      <button type="button">Before</button>
      <div lgToolbar aria-label="Formatting" [orientation]="orientation">
        <button type="button">Bold</button>
        <button type="button" disabled>Italic</button>
        <button type="button">Underline</button>
        <a href="/help">Help</a>
      </div>
      <button type="button">After</button>
    `,
    { imports: [LgToolbar], componentProperties: { orientation } },
  );
  return (name: string) => screen.getByRole(name === 'Help' ? 'link' : 'button', { name });
}

describe('LgToolbar', () => {
  it('is one tab stop with arrow-key navigation that skips disabled items', async () => {
    const item = await setup();
    expect(screen.getByRole('toolbar', { name: 'Formatting' })).toHaveAttribute('aria-orientation', 'horizontal');
    item('Before').focus();
    await userEvent.tab();
    expect(item('Bold')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(item('Underline')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(item('Help')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(item('Bold')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(item('Help')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(item('Bold')).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(item('Help')).toHaveFocus();
    await userEvent.tab();
    expect(item('After')).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(item('Help')).toHaveFocus();
    await expectNoA11yViolations();
  });

  it('uses up and down when vertical', async () => {
    const item = await setup('vertical');
    item('Bold').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(item('Underline')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(item('Bold')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(item('Bold')).toHaveFocus();
  });

  it('follows the reading direction', async () => {
    const item = await setup();
    document.documentElement.dir = 'rtl';
    try {
      item('Bold').focus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item('Underline')).toHaveFocus();
    } finally {
      document.documentElement.dir = '';
    }
  });
});
