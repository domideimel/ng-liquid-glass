# TODO

Work lands on `develop` through PRs; `develop` is merged to `main` for releases. Tick items off here, or move them to GitHub issues once they need discussion.

## Done

- [x] Remove every explicit `changeDetection`: OnPush is the default since Angular 22. Lint now rejects explicit `OnPush` and `Eager` (`allowExplicitOnPush: false`), and the `nx.json` generator overrides are gone.

## CI and repository

Running e2e against the production build (instead of the dev server) caught a real bug: breadcrumb links could be narrower than 44 px. Fixed.

High value:

- [x] Run CI on pushes to `develop` (`ci.yml` only runs on pushes to `main` and on PRs).
- [x] Protect `develop` with a ruleset too (PRs only, same required checks; keep `main` merge-only from `develop`).
- [x] Lint PR titles as Conventional Commits: squash-merge titles become the changelog (`amannn/action-semantic-pull-request`).
- [x] Build the docs once and share them with the three e2e jobs; each browser job builds them again today.
- [x] Find out why WebKit e2e takes ~11 min while Chromium and Firefox take ~2.5 min. It was runner queueing: the WebKit tests take ~2 min; browser caching trims the install.
- [x] Set `timeout-minutes` on every job.
- [ ] Release dry run after the dependency update (#18) to check `release.yml` with the new action versions and the deploy key.

Nice to have:

- [x] Cache Playwright browsers between runs.
- [x] Comment bundle size and coverage deltas against `main` on each PR.
- [x] `actions/dependency-review-action` on PRs; OpenSSF Scorecard; pin actions to commit SHAs (Dependabot keeps them current).
- [x] Visual regression screenshots (light, dark, forced colors) with Playwright.
- [x] Docs previews per PR: the `docs-preview` artifact.
- [x] Nx Cloud remote cache: decided against (local cache is enough; the Nx Cloud skills stay, Nx regenerates them).
- [x] `SECURITY.md`, issue templates (bug, component request).

## Distribution

- [x] Publish to public npm with provenance as well. Installing from GitHub Packages needs a token, even for public packages, which blocks most users. `release.yml` is ready; **you** finish the npm account setup (CONTRIBUTING.md, "Releasing").
- [ ] `ng add` schematic: install, add the theme import to the global stylesheet, check the Tailwind setup.
- [ ] First real release (currently 0.0.1) with a 1.0 checklist: stable APIs, migration notes policy.

## Existing components

- [x] RTL: the switch thumb uses `translate-x-5` and moves the wrong way under `dir="rtl"`. Audit for physical properties (`left`, `ml-`, `translate-x`), then add an RTL e2e pass.
- [x] Forced colors (Windows High Contrast): only the switch handles it. Audit every component and add an e2e run with `forcedColors: 'active'`.
- [x] `prefers-contrast: more`: stronger borders and glass opacity.
- [ ] SSR and hydration smoke test (render every demo on the server, hydrate, run axe).
- [ ] Component test harnesses for consumers (a `testing` entry point per component, CDK-harness style).
- [ ] Theming: document token overrides and support an accent colour besides the neutral primary.
- [ ] i18n: ship ready-made `provideLgI18n` texts for a few languages and document them.

## Missing components

Ordered by how often apps need them:

1. [ ] Select with rich options (listbox popup). Native `<select lgInput>` covers the plain case.
2. [ ] Popover: generic, using the Popover API and anchor positioning, which menu and tooltip already rely on.
3. [ ] Drawer or sheet: a `<dialog>` variant from the edges.
4. [ ] Table: styled native table, sortable headers with `aria-sort`.
5. [ ] Toggle button group or segmented control.
6. [ ] Tag or chip, then chip input.
7. [ ] Toolbar (APG pattern, roving tabindex).
8. [ ] Separator, link, kbd.
9. [ ] Navigation: sidebar or disclosure navigation.
10. [ ] Date field: styled native `type=date` first, picker later.
11. [ ] File input or dropzone.
12. [ ] Stepper, tree view.
13. [ ] Theme switcher (light, dark, system via `data-theme`).
