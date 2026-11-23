# @domideimel/ng-liquid-glass

Accessible, native-first Angular components styled with Tailwind CSS v4, targeting WCAG 2.2 AAA.

- **Small:** 19 entry points, no runtime dependencies, about 30 KB gzipped for everything. You only ship what you import.
- **Native first:** `<button>`, `<input>`, `<select>`, `<dialog>`, `<details>`, `<progress>`, `<meter>` and the Popover API do the heavy lifting.
- **Modern Angular:** standalone, signals, `OnPush`, zoneless-ready, Signal Forms.

## Install

```text
# .npmrc
@domideimel:registry=https://npm.pkg.github.com
```

```bash
pnpm add @domideimel/ng-liquid-glass
```

GitHub Packages needs a token, even for public packages. To install without one, use the tarball attached to each [GitHub release](https://github.com/domideimel/ng-liquid-glass/releases) from 0.2.1 on. It is pinned to that version, and the lockfile records its integrity:

```bash
pnpm add https://github.com/domideimel/ng-liquid-glass/releases/download/v0.2.1/domideimel-ng-liquid-glass-0.2.1.tgz
```

```css
/* styles.css */
@import 'tailwindcss';
@import '@domideimel/ng-liquid-glass/theme.css';
```

```typescript
import { LgButton } from '@domideimel/ng-liquid-glass/button';
```

Peer dependencies: `@angular/core` ^22.2, `tailwindcss` ^4.1, and `@angular/forms` ^22.2 for `forms` and `combobox`.

Full documentation with live demos: https://domideimel.github.io/ng-liquid-glass/
