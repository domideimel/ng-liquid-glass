import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { LG_I18N, LG_I18N_DEFAULTS, provideLgI18n } from './i18n';
import { LG_I18N_DE, LG_I18N_ES, LG_I18N_FR } from './i18n-locales';
import { lgUniqueId } from './id';
import { LgSkipLink } from './skip-link';
import { LgVisuallyHidden } from './visually-hidden';

describe('core', () => {
  it('creates unique ids', () => {
    expect(lgUniqueId('x')).not.toBe(lgUniqueId('x'));
    expect(lgUniqueId('field')).toMatch(/^field-\d+$/);
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
