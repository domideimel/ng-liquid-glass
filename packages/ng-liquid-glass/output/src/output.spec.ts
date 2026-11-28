import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgOutput } from './output';

const long = 'a'.repeat(200);

describe('LgOutput', () => {
  it('keeps line breaks and wraps long values inside the box', async () => {
    await render(
      `<div style="width: 200px">
        <output lgOutput data-testid="out">{{ text }}</output>
        <pre lgOutput mono data-testid="pre">{{ long }}</pre>
      </div>`,
      { imports: [LgOutput], componentProperties: { text: 'line 1\nline 2', long } },
    );
    const out = screen.getByTestId('out');
    expect(getComputedStyle(out).whiteSpace).toBe('pre-wrap');
    expect(getComputedStyle(out).display).toBe('block');
    expect(out).not.toHaveClass('font-mono');
    expect(out.getBoundingClientRect().height).toBeGreaterThan(40);
    const pre = screen.getByTestId('pre');
    expect(pre).toHaveClass('font-mono');
    expect(pre.scrollWidth).toBeLessThanOrEqual(pre.clientWidth);
    expect(Math.round(pre.getBoundingClientRect().width)).toBe(200);
    expect(getComputedStyle(pre).marginTop).toBe('0px');
    await expectNoA11yViolations();
  });
});
