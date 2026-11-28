import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgLink } from './link';
import { LgUrlText } from './url-text';

describe('LgUrlText', () => {
  it('adds a break opportunity after each URL delimiter and keeps the text intact', async () => {
    const url = signal('https://example.com/a/b?x=1&y=2#top');
    const { fixture } = await render(`<a lgLink [href]="url()"><lg-url-text [url]="url()" /></a>`, {
      imports: [LgLink, LgUrlText],
      componentProperties: { url },
    });
    const link = screen.getByRole('link', { name: 'https://example.com/a/b?x=1&y=2#top' });
    const host = link.querySelector('lg-url-text')!;
    expect(host.textContent).toBe('https://example.com/a/b?x=1&y=2#top');
    // https:/ / example.com/ a/ b? x= 1& y= 2# top
    expect(host.querySelectorAll('wbr')).toHaveLength(9);
    // The text and break opportunities in order, ignoring Angular's comment anchors.
    const sequence = [...host.childNodes]
      .filter((node) => node.nodeType !== Node.COMMENT_NODE)
      .map((node) => (node.nodeType === Node.TEXT_NODE ? node.textContent : '|'))
      .join('');
    expect(sequence).toBe('https:/|/|example.com/|a/|b?|x=|1&|y=|2#|top');
    await expectNoA11yViolations();

    url.set('plain');
    fixture.detectChanges();
    expect(host.textContent).toBe('plain');
    expect(host.querySelector('wbr')).toBeNull();
  });

  it('wraps at the delimiters in a narrow box', async () => {
    await render(`<p style="width: 12ch; font-family: monospace"><lg-url-text url="https://example.com/path?query=value" /></p>`, {
      imports: [LgUrlText],
    });
    const host = document.querySelector('lg-url-text')!;
    const range = document.createRange();
    range.selectNodeContents(host);
    const lines = [...range.getClientRects()].map((rect) => Math.round(rect.top));
    expect(new Set(lines).size).toBeGreaterThan(1);
    // Each line ends at a delimiter, not inside a word.
    expect(host.scrollWidth).toBeLessThanOrEqual(host.parentElement!.clientWidth);
  });
});
