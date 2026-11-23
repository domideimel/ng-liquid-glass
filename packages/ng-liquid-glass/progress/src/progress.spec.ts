import { provideLgI18n } from '@domideimel/ng-liquid-glass';
import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgMeter, LgProgress, LgSpinner } from './progress';

describe('progress', () => {
  it('styles native progress and meter elements', async () => {
    await render(
      `<label>Upload <progress lgProgress max="100" value="40"></progress></label>
       <label>Storage <meter lgMeter min="0" max="100" low="70" high="90" value="95"></meter></label>`,
      { imports: [LgProgress, LgMeter] },
    );
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute('value', '40');
    expect(screen.getByRole('meter', { name: 'Storage' })).toHaveClass('rounded-full');
    await expectNoA11yViolations();
  });

  it('announces the spinner with a default or custom label', async () => {
    await render(`<lg-spinner /><lg-spinner label="Saving" />`, { imports: [LgSpinner], providers: [provideLgI18n({ loading: 'Lädt' })] });
    const [first, second] = screen.getAllByRole('status');
    expect(first).toHaveTextContent('Lädt');
    expect(second).toHaveTextContent('Saving');
    expect(first?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('fills the spinner status after it appears, so it is announced', async () => {
    const { fixture } = await render(`<lg-spinner label="Saving" />`, { imports: [LgSpinner] });
    const status = screen.getByRole('status');
    await fixture.whenStable();
    expect(status).toHaveTextContent('Saving');
  });
});
