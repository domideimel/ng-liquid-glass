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
  /** Read after links that open in a new tab. */
  opensInNewTab: string;
  /** Accessible name of a tag's remove button, followed by the tag's text. */
  remove: string;
  /** Announced when `lg-tag-input` adds or removes a tag. */
  tagAdded: (label: string) => string;
  tagRemoved: (label: string) => string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  /** Read after a completed step of `lg-stepper`. */
  completed: string;
  /** `lg-file-input` texts. */
  chooseFiles: string;
  dropFiles: string;
  filesSelected: (count: number) => string;
  /** Shown and announced when files don't match `accept`; `names` is a comma-separated list. */
  filesRejected: (names: string) => string;
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
  opensInNewTab: 'opens in a new tab',
  remove: 'Remove',
  tagAdded: (label) => `${label} added`,
  tagRemoved: (label) => `${label} removed`,
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  completed: 'completed',
  chooseFiles: 'Choose files',
  dropFiles: 'or drop them here',
  filesSelected: (count) => (count === 1 ? '1 file selected' : `${String(count)} files selected`),
  filesRejected: (names) => `Not an accepted file type: ${names}`,
};

export const LG_I18N = new InjectionToken<LgI18n>('LG_I18N', {
  providedIn: 'root',
  factory: () => LG_I18N_DEFAULTS,
});

/** Overrides some or all built-in texts, e.g. `provideLgI18n({ close: 'Schließen' })`. */
export function provideLgI18n(texts: Partial<LgI18n>): Provider {
  return { provide: LG_I18N, useValue: { ...LG_I18N_DEFAULTS, ...texts } };
}
