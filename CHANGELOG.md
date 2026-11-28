## 0.4.0 (2026-11-28)

### 🚀 Features

- output, list, copy button, file drop and form-field errors ([#67](https://github.com/domideimel/ng-liquid-glass/pull/67), [#66](https://github.com/domideimel/ng-liquid-glass/issues/66))

### ❤️ Thank You

- Dominik Deimel @domideimel

## 0.3.3 (2026-11-26)

### 🩹 Fixes

- **combobox:** match text case-insensitively in every script ([#64](https://github.com/domideimel/ng-liquid-glass/pull/64))

### ❤️ Thank You

- Dominik Deimel @domideimel

## 0.3.2 (2026-11-26)

### 🩹 Fixes

- return focus to dialog and popover openers in Safari ([#61](https://github.com/domideimel/ng-liquid-glass/pull/61), [#60](https://github.com/domideimel/ng-liquid-glass/issues/60))
- round circle buttons, outline selected segments, density-aware padding ([#58](https://github.com/domideimel/ng-liquid-glass/pull/58), [#57](https://github.com/domideimel/ng-liquid-glass/issues/57))
- **forms:** keep native selects 44 px tall in Safari ([#59](https://github.com/domideimel/ng-liquid-glass/pull/59))

### ❤️ Thank You

- Dominik Deimel @domideimel

## 0.3.1 (2026-11-24)

### 🩹 Fixes

- don't ship the lg-contrast test in the package ([#53](https://github.com/domideimel/ng-liquid-glass/pull/53))

### ❤️ Thank You

- Dominik Deimel @domideimel

## 0.3.0 (2026-11-24)

### 🚀 Features

- add compact density and let <label for> reach custom controls ([#48](https://github.com/domideimel/ng-liquid-glass/pull/48))
- **button:** add sizes, round icon buttons and a badge pattern ([#46](https://github.com/domideimel/ng-liquid-glass/pull/46))
- **dialog:** add alert dialogs, responsive sheets, a closed output and safe areas ([#44](https://github.com/domideimel/ng-liquid-glass/pull/44))
- **number-field:** add a number field with stepper buttons ([#47](https://github.com/domideimel/ng-liquid-glass/pull/47))
- **theme:** add display type, accent tint, accent presets, a contrast checker and theme-color sync ([#45](https://github.com/domideimel/ng-liquid-glass/pull/45))

### ❤️ Thank You

- Dominik Deimel @domideimel

## 0.2.0 (2026-11-23)

### 🩹 Fixes

- ⚠️  resolve the bugs found in the code review ([#31](https://github.com/domideimel/ng-liquid-glass/pull/31))

### ⚠️  Breaking Changes

- resolve the bugs found in the code review  ([#31](https://github.com/domideimel/ng-liquid-glass/pull/31))
  LgToaster.paused is now read-only; the region calls
  pause(reason)/resume(reason) instead of setting it. LgI18n has a new
  filesRejected text; a complete custom LgI18n object needs it.

### ❤️ Thank You

- Dominik Deimel @domideimel

## 0.1.0 (2026-11-21)

### 🚀 Features

- support right-to-left, forced colors and prefers-contrast ([#22](https://github.com/domideimel/ng-liquid-glass/pull/22))
- add test harnesses, translations, an accent colour and an SSR smoke test ([#23](https://github.com/domideimel/ng-liquid-glass/pull/23))
- add an ng add schematic and prepare the first release ([#24](https://github.com/domideimel/ng-liquid-glass/pull/24))
- add 17 components from the TODO list ([#25](https://github.com/domideimel/ng-liquid-glass/pull/25))
- **accordion:** add accordion on native details/summary ([9dece79](https://github.com/domideimel/ng-liquid-glass/commit/9dece79))
- **alert:** add inline alert with status variants ([e32491b](https://github.com/domideimel/ng-liquid-glass/commit/e32491b))
- **avatar:** add avatar with initials fallback ([3b319cf](https://github.com/domideimel/ng-liquid-glass/commit/3b319cf))
- **badge:** add status badge ([c44ab08](https://github.com/domideimel/ng-liquid-glass/commit/c44ab08))
- **breadcrumbs:** add router-agnostic breadcrumb styling ([bf253f3](https://github.com/domideimel/ng-liquid-glass/commit/bf253f3))
- **button:** add button directive for native buttons and links ([c9d8e91](https://github.com/domideimel/ng-liquid-glass/commit/c9d8e91))
- **card:** add solid and glass card surface ([e40c0aa](https://github.com/domideimel/ng-liquid-glass/commit/e40c0aa))
- **combobox:** add accessible typeahead with Signal Forms support ([6f1c14e](https://github.com/domideimel/ng-liquid-glass/commit/6f1c14e))
- **core:** add ids, i18n, skip link, visually hidden and status icon ([26e4c68](https://github.com/domideimel/ng-liquid-glass/commit/26e4c68))
- **dialog:** add modal dialog built on native <dialog> ([9a00eb7](https://github.com/domideimel/ng-liquid-glass/commit/9a00eb7))
- **forms:** add Signal Forms form field and native controls ([e4b31e5](https://github.com/domideimel/ng-liquid-glass/commit/e4b31e5))
- **layout:** add container-query grid, container, stack and cluster ([f70bbbf](https://github.com/domideimel/ng-liquid-glass/commit/f70bbbf))
- **menu:** add menu button with popover and anchor positioning ([458ee16](https://github.com/domideimel/ng-liquid-glass/commit/458ee16))
- **pagination:** add pagination with page window ([a182ae8](https://github.com/domideimel/ng-liquid-glass/commit/a182ae8))
- **progress:** add progress, meter and spinner ([94087a1](https://github.com/domideimel/ng-liquid-glass/commit/94087a1))
- **skeleton:** add loading skeleton ([643846e](https://github.com/domideimel/ng-liquid-glass/commit/643846e))
- **tabs:** add tabs with automatic activation and roving focus ([d28e41d](https://github.com/domideimel/ng-liquid-glass/commit/d28e41d))
- **theme:** add WCAG AAA design tokens for Tailwind CSS v4 ([07cf502](https://github.com/domideimel/ng-liquid-glass/commit/07cf502))
- **toast:** add toaster service and live region ([e12547d](https://github.com/domideimel/ng-liquid-glass/commit/e12547d))
- **tooltip:** add hoverable, dismissible tooltip (WCAG 1.4.13) ([e3fd8b2](https://github.com/domideimel/ng-liquid-glass/commit/e3fd8b2))

### 🩹 Fixes

- **docs:** give demos the library text colour ([f4e135f](https://github.com/domideimel/ng-liquid-glass/commit/f4e135f))

### ❤️ Thank You

- Dominik Deimel @domideimel