import { InjectionToken, type Provider } from '@angular/core';

/** Every text the library renders itself. Override them to translate the components. */
export interface LgI18n {
  close: string;
  dismiss: string;
  loading: string;
  noResults: string;
  /** Announced to screen readers when the number of typeahead suggestions changes. */
  resultsCount: (count: number) => string;
  breadcrumbs: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  page: (page: number) => string;
  notifications: string;
}

export const LG_I18N_DEFAULTS: LgI18n = {
  close: 'Close',
  dismiss: 'Dismiss',
  loading: 'Loading',
  noResults: 'No results',
  resultsCount: (count) => (count === 1 ? '1 result available' : `${String(count)} results available`),
  breadcrumbs: 'Breadcrumb',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: (page) => `Page ${String(page)}`,
  notifications: 'Notifications',
};

export const LG_I18N = new InjectionToken<LgI18n>('LG_I18N', {
  providedIn: 'root',
  factory: () => LG_I18N_DEFAULTS,
});

/** Overrides some or all built-in texts, e.g. `provideLgI18n({ close: 'Schließen' })`. */
export function provideLgI18n(texts: Partial<LgI18n>): Provider {
  return { provide: LG_I18N, useValue: { ...LG_I18N_DEFAULTS, ...texts } };
}
