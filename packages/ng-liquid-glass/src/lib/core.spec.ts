import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LG_I18N, LG_I18N_DEFAULTS, provideLgI18n } from './i18n';
import { LG_I18N_DE, LG_I18N_ES, LG_I18N_FR } from './i18n-locales';
import { lgAnnouncement } from './announce';
import { LgIdCounter, lgUniqueId } from './id';
import { LgTypeahead } from './typeahead';
import { LgSkipLink } from './skip-link';
import { LgVisuallyHidden } from './visually-hidden';

describe('core', () => {
  it('makes repeated announcements differ', () => {
    expect(lgAnnouncement('', 'Saved')).toBe('Saved');
    const repeated = lgAnnouncement('Saved', 'Saved');
    expect(repeated).not.toBe('Saved');
    expect(repeated.trim()).toBe('Saved');
    expect(lgAnnouncement(repeated, 'Saved')).toBe('Saved');
  });

  it('matches typed text, cycles on a repeated character and ignores shortcuts', () => {
    vi.useFakeTimers();
    try {
      const typeahead = TestBed.runInInjectionContext(() => new LgTypeahead());
      const labels = ['Apple', 'Banana', 'Blueberry', 'Cherry'];
      const key = (k: string, init: KeyboardEventInit = {}) => new KeyboardEvent('keydown', { key: k, ...init });
      expect(typeahead.match(key('b'), labels, -1)).toBe(1);
      expect(typeahead.typing).toBe(true);
      expect(typeahead.match(key('l'), labels, 1)).toBe(2);
      vi.advanceTimersByTime(500);
      expect(typeahead.typing).toBe(false);
      expect(typeahead.match(key('b'), labels, 1)).toBe(2);
      expect(typeahead.match(key('b'), labels, 2)).toBe(1);
      typeahead.reset();
      expect(typeahead.match(key('a'), labels, 3)).toBe(0);
      expect(typeahead.match(key('z'), labels, 0)).toBe(-1);
      expect(typeahead.match(key('ArrowDown'), labels, 0)).toBeNull();
      expect(typeahead.match(key('c', { ctrlKey: true }), labels, 0)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('creates unique ids', () => {
    expect(lgUniqueId('x')).not.toBe(lgUniqueId('x'));
    expect(lgUniqueId('field')).toMatch(/^field-\d+$/);
  });

  it('counts ids per application inside an injection context', () => {
    const first = TestBed.runInInjectionContext(() => lgUniqueId('lg-x'));
    const second = TestBed.runInInjectionContext(() => lgUniqueId('lg-x'));
    expect([first, second]).toEqual(['lg-x-1', 'lg-x-2']);
    expect(TestBed.inject(LgIdCounter).next()).toBe(3);
  });

  it('provides default texts', () => {
    expect(TestBed.inject(LG_I18N)).toBe(LG_I18N_DEFAULTS);
    expect(LG_I18N_DEFAULTS.resultsCount(1)).toBe('1 result available');
    expect(LG_I18N_DEFAULTS.resultsCount(3)).toBe('3 results available');
    expect(LG_I18N_DEFAULTS.page(2)).toBe('Page 2');
  });

  it('merges overridden texts', () => {
    TestBed.configureTestingModule({ providers: [provideLgI18n({ close: 'Schließen' })] });
    const texts = TestBed.inject(LG_I18N);
    expect(texts.close).toBe('Schließen');
    expect(texts.dismiss).toBe('Dismiss');
  });

  it('ships complete German, French and Spanish texts', () => {
    for (const locale of [LG_I18N_DE, LG_I18N_FR, LG_I18N_ES]) {
      expect(Object.keys(locale).sort()).toEqual(Object.keys(LG_I18N_DEFAULTS).sort());
      expect(locale.resultsCount(1)).toMatch(/^1 /);
      expect(locale.resultsCount(3)).toMatch(/^3 /);
      expect(locale.page(4)).toContain('4');
    }
    TestBed.configureTestingModule({ providers: [provideLgI18n(LG_I18N_DE)] });
    expect(TestBed.inject(LG_I18N).nextPage).toBe('Nächste Seite');
    expect(LG_I18N_FR.resultsCount(2)).toBe('2 résultats disponibles');
    expect(LG_I18N_ES.resultsCount(1)).toBe('1 resultado disponible');
  });

  it('fills every message function of every locale with its argument', () => {
    for (const locale of [LG_I18N_DEFAULTS, LG_I18N_DE, LG_I18N_FR, LG_I18N_ES]) {
      for (const [key, value] of Object.entries(locale)) {
        if (typeof value !== 'function') continue;
        const fill = value as (arg: number | string) => string;
        if (key === 'tagAdded' || key === 'tagRemoved' || key === 'filesRejected') {
          expect(fill('report.pdf'), key).toContain('report.pdf');
        } else {
          // Singular and plural forms.
          expect(fill(1), key).toContain('1');
          expect(fill(7), key).toContain('7');
        }
      }
    }
  });

  it('renders an accessible skip link and visually hidden text', async () => {
    @Component({
      imports: [LgSkipLink, LgVisuallyHidden],
      template: `
        <a lgSkipLink href="#main">Skip to content</a>
        <main id="main">
          <button type="button">Save<span lgVisuallyHidden> profile</span></button>
        </main>
      `,
    })
    class Host {}
    await render(Host);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveClass('sr-only');
    expect(screen.getByRole('button', { name: /Save\s*profile/ })).toBeInTheDocument();
    await expectNoA11yViolations();
  });
});
