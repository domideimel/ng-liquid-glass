# Contributing

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
