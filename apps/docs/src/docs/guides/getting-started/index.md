`@domideimel/ng-liquid-glass` is a small set of accessible Angular components. They are built on native HTML elements wherever one exists, styled with Tailwind CSS v4, and meant to meet WCAG 2.2 AAA.

- **Small:** every component is its own entry point and the package has no runtime dependencies. Each entry point is under 5 KB gzipped, and you only ship what you import.
- **Native first:** `<button>`, `<input>`, `<select>`, `<dialog>`, `<details>`, `<progress>`, `<meter>` and the Popover API do the heavy lifting.
- **Modern Angular:** standalone, signal inputs/models, OnPush by default, zoneless-ready, Signal Forms.

## Installation

The package is published to GitHub Packages. Point the `@domideimel` scope at it once (in your project's `.npmrc`) and authenticate with a token that has `read:packages`:

```text
@domideimel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
pnpm add @domideimel/ng-liquid-glass
pnpm add -D tailwindcss @tailwindcss/postcss
```

Requirements: Angular 22.2+, Tailwind CSS 4.1+.

Angular CLI builds pick Tailwind up through PostCSS; add a `.postcssrc.json` next to `angular.json`:

```json
{ "plugins": { "@tailwindcss/postcss": {} } }
```

## Set up with ng add

Once the registry is configured, `ng add` installs the package and adds the theme to your global stylesheet. It also adds `@import 'tailwindcss'` if that is missing, and says what else Tailwind needs. Pick a language for the built-in texts at the prompt, or pass it:

```bash
ng add @domideimel/ng-liquid-glass --locale=de
```

In an Nx workspace: `nx g @domideimel/ng-liquid-glass:ng-add --project=my-app`. Or set it up by hand:

## Styles

Add the theme after Tailwind in your global stylesheet. It defines the colour tokens and tells Tailwind to scan the library's components for classes:

```css
@import 'tailwindcss';
@import '@domideimel/ng-liquid-glass/theme.css';
```

## Use a component

Import what you need from its entry point:

```typescript
import { Component } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';

@Component({
  selector: 'app-root',
  imports: [LgButton],
  template: `<button lgButton variant="primary" type="button">Save</button>`,
})
export class App {}
```

## Entry points

| Import from                   | Contents                                                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `@domideimel/ng-liquid-glass` | `LgSkipLink`, `LgVisuallyHidden`, `provideLgI18n`, `LG_I18N_DE`/`_FR`/`_ES`, `LgStatusIcon`                                         |
| `…/accordion`                 | `LgAccordionItem`                                                                                                                   |
| `…/alert`                     | `LgAlert`                                                                                                                           |
| `…/avatar`                    | `LgAvatar`                                                                                                                          |
| `…/badge`                     | `LgBadge`                                                                                                                           |
| `…/breadcrumbs`               | `LgBreadcrumbs`                                                                                                                     |
| `…/button`                    | `LgButton`                                                                                                                          |
| `…/card`                      | `LgCard`                                                                                                                            |
| `…/combobox`                  | `LgCombobox` (typeahead)                                                                                                            |
| `…/dialog`                    | `LgDialog` (also drawers and sheets), `LgDialogTitle`, `LgDialogClose`                                                              |
| `…/file-input`                | `LgFileInput`                                                                                                                       |
| `…/forms`                     | `LgFormField`, `LgLabel`, `LgHint`, `LgError`, `LgInput`, `LgCheckbox`, `LgRadio`, `LgSwitch`, `LgSlider`, `LgChoice`, `LgFieldset` |
| `…/kbd`                       | `LgKbd`                                                                                                                             |
| `…/layout`                    | `LgGrid`, `LgCol`, `LgContainer`, `LgStack`, `LgCluster`                                                                            |
| `…/link`                      | `LgLink`                                                                                                                            |
| `…/menu`                      | `LgMenu`, `LgMenuItem`, `LgMenuTrigger`                                                                                             |
| `…/navigation`                | `LgNav`, `LgNavLink`, `LgNavGroup`                                                                                                  |
| `…/pagination`                | `LgPagination`                                                                                                                      |
| `…/popover`                   | `LgPopover`, `LgPopoverTrigger`                                                                                                     |
| `…/progress`                  | `LgProgress`, `LgMeter`, `LgSpinner`                                                                                                |
| `…/segmented`                 | `LgSegmented`, `LgSegment`, `LgToggle`                                                                                              |
| `…/select`                    | `LgSelect`                                                                                                                          |
| `…/separator`                 | `LgSeparator`                                                                                                                       |
| `…/skeleton`                  | `LgSkeleton`                                                                                                                        |
| `…/stepper`                   | `LgStepper`                                                                                                                         |
| `…/table`                     | `LgTable`, `LgSortHeader`, `LgTableScroll`, `lgSortRows`                                                                            |
| `…/tabs`                      | `LgTabs`, `LgTab`, `LgTabPanel`                                                                                                     |
| `…/tag`                       | `LgTag`, `LgTagInput`                                                                                                               |
| `…/testing`                   | Component test harnesses (needs `@angular/cdk`), see [Testing](guides/testing)                                                      |
| `…/theme`                     | `LgTheme`, `LgThemeSwitcher`                                                                                                        |
| `…/toast`                     | `LgToaster`, `LgToasterRegion`                                                                                                      |
| `…/toolbar`                   | `LgToolbar`, `LgToolbarItem`                                                                                                        |
| `…/tooltip`                   | `LgTooltip`                                                                                                                         |
| `…/tree`                      | `LgTree`                                                                                                                            |

## Translations

German, French and Spanish are built in. Provide one at bootstrap:

```typescript
import { LG_I18N_DE, provideLgI18n } from '@domideimel/ng-liquid-glass';

bootstrapApplication(App, { providers: [provideLgI18n(LG_I18N_DE)] });
```

| Locale  | Constant      |
| ------- | ------------- |
| English | (the default) |
| German  | `LG_I18N_DE`  |
| French  | `LG_I18N_FR`  |
| Spanish | `LG_I18N_ES`  |

For another language, or to change single texts, pass your own; missing texts fall back to English:

```typescript
provideLgI18n({ ...LG_I18N_DE, close: 'Zumachen' });
provideLgI18n({ close: 'Chiudi', noResults: 'Nessun risultato', resultsCount: (n) => `${n} risultati` });
```
