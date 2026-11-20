import type { LgI18n } from './i18n';

/**
 * Ready-made translations of the built-in texts. Each is a complete `LgI18n`; pass it to `provideLgI18n`,
 * optionally spread with your own overrides: `provideLgI18n({ ...LG_I18N_DE, close: 'Zu' })`.
 * Unused locales are tree-shaken.
 */
export const LG_I18N_DE: LgI18n = {
  close: 'Schließen',
  dismiss: 'Ausblenden',
  loading: 'Wird geladen',
  noResults: 'Keine Treffer',
  resultsCount: (count) => (count === 1 ? '1 Treffer verfügbar' : `${String(count)} Treffer verfügbar`),
  breadcrumbs: 'Brotkrümelnavigation',
  pagination: 'Seitennavigation',
  previousPage: 'Vorherige Seite',
  nextPage: 'Nächste Seite',
  page: (page) => `Seite ${String(page)}`,
  notifications: 'Benachrichtigungen',
};

export const LG_I18N_FR: LgI18n = {
  close: 'Fermer',
  dismiss: 'Ignorer',
  loading: 'Chargement',
  noResults: 'Aucun résultat',
  resultsCount: (count) => (count === 1 ? '1 résultat disponible' : `${String(count)} résultats disponibles`),
  breadcrumbs: "Fil d'Ariane",
  pagination: 'Pagination',
  previousPage: 'Page précédente',
  nextPage: 'Page suivante',
  page: (page) => `Page ${String(page)}`,
  notifications: 'Notifications',
};

export const LG_I18N_ES: LgI18n = {
  close: 'Cerrar',
  dismiss: 'Descartar',
  loading: 'Cargando',
  noResults: 'Sin resultados',
  resultsCount: (count) => (count === 1 ? '1 resultado disponible' : `${String(count)} resultados disponibles`),
  breadcrumbs: 'Ruta de navegación',
  pagination: 'Paginación',
  previousPage: 'Página anterior',
  nextPage: 'Página siguiente',
  page: (page) => `Página ${String(page)}`,
  notifications: 'Notificaciones',
};
