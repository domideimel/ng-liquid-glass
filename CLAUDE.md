# ng-liquid-glass — agent guide

An accessible Angular component library (`@domideimel/ng-liquid-glass`) targeting WCAG 2.2 AAA, with NgDoc docs. Read [README.md](README.md) for the workspace layout and quality gates and [CONTRIBUTING.md](CONTRIBUTING.md) for the component checklist; this file only adds what agents get wrong.

## Stack

Nx 24 · Angular 22.2 (standalone, zoneless, signals, Signal Forms, `OnPush`) · Tailwind CSS 4 · NgDoc 22 · Vitest 5 in real Chromium · Playwright · pnpm 12 · Node 24.

## Skills

- `angular-developer` (official, from [angular/skills](https://github.com/angular/skills), pinned in `skills-lock.json`): Angular APIs and patterns. Update with `npx skills update angular-developer`.
- `nx-*` skills: workspace queries, generators, running tasks (see the Nx section below).

The Angular skill assumes a plain Angular CLI project. Here, Nx wins:

- Never run `ng …`. Build, test and lint through Nx: `pnpm nx build ng-liquid-glass`, `pnpm nx test ng-liquid-glass`, `pnpm lint`.
- Scaffold with Nx generators (`pnpm nx g @nx/angular:…`), not `ng generate`. A new component is a secondary entry point; the command is in CONTRIBUTING.md.
- Do not upgrade Angular or Nx, or remove the `@angular-devkit/architect` pin in `pnpm-workspace.yaml` (see README, "Known constraint").

## Library rules

- Native elements first; otherwise follow the matching WAI-ARIA APG pattern.
- Only `lg-*` theme tokens from `packages/ng-liquid-glass/styles`; text contrast ≥ 7:1, targets ≥ 44 × 44 px, `lg-focus-ring` on everything focusable.
- Tailwind class names as complete string literals, never built from pieces.
- Signal inputs/outputs/queries, `ChangeDetectionStrategy.OnPush`, no `zone.js`, no NgModules.
- Specs use Testing Library and cover ARIA states, keyboard behaviour and `expectNoA11yViolations()`. Coverage gates: ≥ 95 % statements/functions/lines, ≥ 90 % branches.
- Every component has a docs demo in `apps/docs` and an entry in `apps/docs-e2e/src/pages.ts`.
- The library must stay under a 40 KB gzipped budget (`pnpm size`).

## Workflow

- `main` is protected: work on a branch and open a PR. The required checks are lint/typecheck/test/build, e2e in Chromium, Firefox and WebKit, and CodeQL.
- Conventional Commits with entry-point scopes (`feat(combobox): …`); the changelog and version come from them.
- Before pushing: `pnpm nx format:write`, then `pnpm lint && pnpm test && pnpm build && pnpm e2e`.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
