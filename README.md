# ng-liquid-glass

An accessible, native-first Angular component library styled with Tailwind CSS v4, targeting **WCAG 2.2 AAA**, with documentation and live demos built with [NgDoc](https://ng-doc.com).

📦 `@domideimel/ng-liquid-glass` on GitHub Packages · 📖 [Documentation](https://domideimel.github.io/ng-liquid-glass/)

## Workspace

| Path                       | Project           | What                                                                                 |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `packages/ng-liquid-glass` | `ng-liquid-glass` | The publishable library: one secondary entry point per component, `styles/theme.css` |
| `apps/docs`                | `docs`            | NgDoc documentation site with a demo for every component                             |
| `apps/docs-e2e`            | `docs-e2e`        | Playwright: axe (WCAG A–AAA) and 44 px target checks on every demo, keyboard flows   |
| `tools`                    | —                 | `size-report.mjs`, the bundle-size budget used in CI                                 |

Stack: Nx 24 · Angular 22.2 (zoneless, signals, Signal Forms) · Tailwind CSS 4 · NgDoc 22 · Vitest 5 in real Chromium · Playwright · pnpm 12.

## Commands

```bash
pnpm install
pnpm start                         # docs at http://localhost:4200
pnpm nx test ng-liquid-glass       # unit tests in headless Chromium, with coverage gates
pnpm nx build ng-liquid-glass      # library → dist/packages/ng-liquid-glass
pnpm lint                          # ESLint (strict, type-aware) + type checks
pnpm e2e                           # accessibility e2e against the docs
pnpm size                          # gzipped size per entry point
```

Browser tests use Playwright's Chromium (`pnpm exec playwright install chromium`). To use an installed Chrome instead, set `CHROME_BIN` (unit tests) or `CHROMIUM_PATH` (e2e).

## Quality gates

- **TypeScript:** `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and related flags.
- **Angular compiler:** strict templates and host bindings, with extended diagnostics treated as errors.
- **ESLint:** `typescript-eslint` `strictTypeChecked` + `stylisticTypeChecked`, angular-eslint template accessibility rules, and Nx module boundaries.
- **Unit tests:** every component is checked with axe-core. Coverage must stay ≥ 95 % statements, functions and lines, and ≥ 90 % branches.
- **E2E:** every demo in light and dark mode is checked with axe, including the AAA rules, plus a 44 × 44 px target-size check.
- **Bundle size:** the library must stay under a 40 KB gzipped budget.

## CI/CD

| Workflow      | Trigger             | Does                                                                                                                                  |
| ------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`      | push to `main`, PRs | format check, lint, typecheck, unit tests, build, size budget; e2e in Chromium, Firefox and WebKit                                    |
| `docs.yml`    | push to `main`      | deploys the docs to GitHub Pages (enable _Pages → Source: GitHub Actions_ once)                                                       |
| `release.yml` | manual              | `nx release`: version from Conventional Commits, `CHANGELOG.md`, tag, GitHub release, publish to GitHub Packages (dry run by default) |
| `codeql.yml`  | push, PRs, weekly   | security analysis                                                                                                                     |

Dependabot keeps npm packages and actions up to date, grouped by ecosystem.

## Known constraint

`pnpm-workspace.yaml` pins `@angular-devkit/architect` to `0.2202.8`, because Nx 24.0 cannot load the `exports` map added in 0.2203 (Angular 22.3). That is also why the workspace uses Angular 22.2. Remove the override and upgrade once Nx supports it.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
