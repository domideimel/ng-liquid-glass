# Contributing

## Branches

Branch off `develop` and open your PR against `develop`; it is squash-merged, so its title must be a Conventional Commit. `main` only receives releases from `develop`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org); releases and the changelog are generated from them.

```text
feat(combobox): support option groups
fix(menu): return focus to the trigger after Tab
docs(tabs): document vertical orientation
```

Scopes are the entry point names (`button`, `forms`, `combobox`, …), or `docs`, `e2e`, `ci`, `deps`.

## A new component

1. Create the entry point: `pnpm nx g @nx/angular:library-secondary-entry-point --library=ng-liquid-glass --name=<name> --skipModule`.
2. Build on a native element if one exists. If not, follow the matching [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern.
3. Use `lg-*` theme tokens only, keep text at 7:1 and targets at 44 × 44 px, and use `lg-focus-ring` on everything focusable.
4. Write class names as complete string literals so Tailwind can find them.
5. Write specs with Testing Library, covering ARIA states, the keyboard and `expectNoA11yViolations()`.
6. Add a docs page with a demo, and add it to `apps/docs-e2e/src/pages.ts`.

## Before you push

```bash
pnpm nx format:write
pnpm lint && pnpm test && pnpm build && pnpm e2e
```

## Visual changes

CI compares every demo's screenshots (light, right-to-left, forced colors; Chromium) with the latest screenshots of the PR's base branch. When a PR changes the look on purpose:

1. Check the differences in the failed run's `playwright-chromium` report artifact.
2. Add the label `accept-visual-changes` to the PR. CI then records the new screenshots instead of comparing; they are in the `screenshots` artifact.
3. After the merge, the push run on the base branch stores them as the new baseline (`visual-baselines`, kept 90 days; any push refreshes it).

## Releasing

1. Open a PR from `develop` into `main` and merge it with a merge commit. `develop` is fast-forwarded automatically.
2. Run the _Release_ workflow on `main`: first as a dry run (the default) to check the version and changelog, then for real. The version comes from the Conventional Commits since the last tag; set the _version_ input (`0.1.0`, `minor`) to override it, e.g. for the first release.

Publishing to npmjs.com (in addition to GitHub Packages) is off until it is set up:

1. Create the `@domideimel` scope on npmjs.com, i.e. an npm account or organisation named `domideimel`.
2. First publish: add an npm automation token as the repository secret `NPM_TOKEN`. Trusted publishing can only be configured for a package that already exists.
3. Set the repository variable `NPM_PUBLISH` to `true` (_Settings → Secrets and variables → Actions → Variables_).
4. After the first publish, configure trusted publishing on npmjs.com (package settings: repository `domideimel/ng-liquid-glass`, workflow `release.yml`), then delete the `NPM_TOKEN` secret. Releases then authenticate with OIDC and carry provenance.

## Versioning and 1.0

Until 1.0, minor versions may contain breaking changes. Every breaking change is a `feat!:`/`fix!:` commit, or has a `BREAKING CHANGE:` footer, and its commit body says how to migrate. The changelog carries that text, so it is the migration guide.

1.0 ships when all of these hold:

- [ ] Every component in TODO.md's "Missing components" list that is planned for 1.0 is released.
- [ ] Every public API has been reviewed for naming and consistency (inputs, outputs, selectors, CSS tokens), and the API reference is complete.
- [ ] Each component has been checked with NVDA + Firefox and VoiceOver + Safari.
- [ ] The package is on npmjs.com with provenance.
- [ ] No open bug with the `bug` label.

From 1.0 on, the library follows semantic versioning: breaking changes only in major versions, with a migration section in the release notes.
