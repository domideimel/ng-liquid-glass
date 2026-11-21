# ng-liquid-glass

An accessible, native-first Angular component library styled with Tailwind CSS v4, targeting **WCAG 2.2 AAA**, with documentation and live demos built with [NgDoc](https://ng-doc.com).

📦 `@domideimel/ng-liquid-glass` on GitHub Packages · 📖 [Documentation](https://domideimel.github.io/ng-liquid-glass/)

## Workspace

| Path                       | Project           | What                                                                                 |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `packages/ng-liquid-glass` | `ng-liquid-glass` | The publishable library: one secondary entry point per component, `styles/theme.css` |
| `apps/docs`                | `docs`            | NgDoc documentation site with a demo for every component                             |
| `apps/docs-e2e`            | `docs-e2e`        | Playwright: axe (WCAG A–AAA) and 44 px target checks on every demo, keyboard flows   |
| `tools`                    | —                 | `size-report.mjs`, the per-entry bundle-size budget used in CI                       |

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
- **Bundle size:** every entry point must stay under 5 KB gzipped; apps only ship the entry points they import.

## CI/CD

| Workflow           | Trigger                       | Does                                                                                                                                                     |
| ------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`           | push to `main`/`develop`, PRs | format check, lint, typecheck, unit tests, library build, size budget; one production docs build, shared by the e2e jobs in Chromium, Firefox and WebKit |
| `pr.yml`           | PRs                           | Conventional Commits PR title (it becomes the squash commit and changelog entry); dependency review                                                      |
| `docs.yml`         | push to `main`                | deploys the docs to GitHub Pages                                                                                                                         |
| `sync-develop.yml` | push to `main`                | fast-forwards `develop` to `main` (after a release merge or the release commit)                                                                          |
| `release.yml`      | manual                        | `nx release`: version, `CHANGELOG.md`, tag, GitHub release, publish to GitHub Packages and, once enabled, npmjs.com with provenance (dry run by default) |
| `codeql.yml`       | push, PRs, weekly             | security analysis                                                                                                                                        |
| `scorecard.yml`    | push to `main`, weekly        | OpenSSF Scorecard                                                                                                                                        |

On every PR:

- a comment with the bundle size and coverage, and their change against the base branch;
- the built docs as the `docs-preview` artifact (download it, then `npx vite preview --outDir <folder>`).

Actions are pinned to commit SHAs. Dependabot keeps npm packages and actions up to date, in a few grouped PRs.

### Branches and protection

Work happens on feature branches off `develop`, squash-merged into `develop`. A release is a PR from `develop` into `main`, merged with a merge commit. `sync-develop.yml` then fast-forwards `develop` to `main`, so the two never drift apart.

Both branches are protected by the rulesets in [`.github/rulesets`](.github/rulesets):

- changes only through pull requests, with all review threads resolved. `develop` takes squash merges only and keeps a linear history; `main` takes merge commits (from `develop`) and squash merges (hotfixes);
- required checks, which must pass on an up-to-date branch: lint/typecheck/test/build, the docs build, e2e in Chromium, Firefox and WebKit, CodeQL, the PR title and dependency review;
- no force pushes, no deletion;
- only deploy keys may bypass them. The release and sync workflows push with the `RELEASE_DEPLOY_KEY` deploy key, because on a personal repository GitHub Actions itself can't be a bypass actor.

Apply a changed ruleset with `gh api -X PUT repos/domideimel/ng-liquid-glass/rulesets/<id> --input .github/rulesets/<file>.json` (`gh api repos/domideimel/ng-liquid-glass/rulesets` lists the ids), or create one with `-X POST …/rulesets`.

## Known constraint

`pnpm-workspace.yaml` pins `@angular-devkit/architect` to `0.2202.8`, because Nx 24.0 cannot load the `exports` map added in 0.2203 (Angular 22.3). That is also why the workspace uses Angular 22.2. Remove the override and upgrade once Nx supports it.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
