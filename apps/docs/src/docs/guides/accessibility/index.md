The library targets **WCAG 2.2 level AAA** for everything a component controls. Some criteria depend on your content and pages, so a library alone cannot make an app conform. The table shows who is responsible for what.

## What the components guarantee

| Criterion                                               | Level    | How                                                                                                    |
| ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| 1.4.6 Contrast (Enhanced)                               | AAA      | All text tokens ≥ 7:1 in light and dark mode, verified in CI with axe `color-contrast-enhanced`        |
| 1.4.11 Non-text Contrast                                | AA       | Control borders and focus ring ≥ 3:1                                                                   |
| 2.1.1 / 2.1.3 Keyboard (No Exception)                   | AAA      | Every component is fully keyboard operable, following the WAI-ARIA Authoring Practices                 |
| 2.2.3 No Timing                                         | AAA      | Toasts stay until dismissed by default; timed toasts pause on hover and focus                          |
| 2.3.3 Animation from Interactions                       | AAA      | All transitions and animations are disabled under `prefers-reduced-motion`                             |
| 2.4.1 Bypass Blocks                                     | A        | `LgSkipLink`                                                                                           |
| 2.4.7 / 2.4.13 Focus Visible / Appearance               | AA / AAA | 3 px, high-contrast focus ring with offset                                                             |
| 2.5.5 Target Size (Enhanced)                            | AAA      | Interactive targets are at least 44 × 44 px; checkboxes and radios through their `lgChoice` label row  |
| 1.3.1 / 4.1.2 Info and Relationships, Name, Role, Value | A        | Native elements first; ARIA only where HTML has no element (combobox, menu, tabs)                      |
| 1.4.1 Use of Color                                      | A        | Status is always given in text; icons are decorative                                                   |
| 1.4.13 Content on Hover or Focus                        | AA       | Tooltips are hoverable, dismissible with Escape, and persistent                                        |
| 3.3.1 / 3.3.3 Error Identification / Suggestion         | A / AA   | `lg-form-field` shows validator messages and links them with `aria-describedby`                        |
| 4.1.3 Status Messages                                   | AA       | Toasts, combobox result counts and form errors use live regions                                        |
| 1.4.11 Non-text Contrast in forced colors               | AA       | In Windows High Contrast, selected tabs, the current page and the active option use system `Highlight` |
| 1.3.2 Meaningful Sequence (right-to-left)               | A        | Logical CSS properties only; arrow keys in tabs follow the reading direction under `dir="rtl"`         |

## What your application must do

- **Content:** reading level (3.1.5), unusual words and abbreviations (3.1.3, 3.1.4), sign language and extended audio description for media (1.2.6–1.2.9).
- **Pages:** a page `<title>` and `lang` (2.4.2, 3.1.1), headings and landmarks (2.4.6, 2.4.10), consistent navigation (3.2.3, 3.2.4), and the location within a site (2.4.8, e.g. with breadcrumbs).
- **Behaviour:** no re-authentication data loss (2.2.5), help on forms (3.3.5), and error prevention for all submissions (3.3.6).
- **Your own markup:** a missing label or a custom colour can still break conformance. Keep `<label lgLabel>` and `aria-label` on icon-only buttons.

## How it is tested

1. **Unit tests** run in a real Chromium with Vitest. Each component's rendered DOM is checked with axe-core (WCAG 2.x A/AA and best-practice rules), along with keyboard behaviour and ARIA states.
2. **End-to-end tests** with Playwright load every documentation page of the production build in light and dark mode, in Chromium, Firefox and WebKit. They run axe including the AAA rules (`color-contrast-enhanced`, `target-size`) against the real styles, repeat it right-to-left, and check that selected states stay visible in forced colors.
3. **Visual regression:** every demo is compared with its rendering on the base branch, in light mode, right-to-left and forced colors.
4. **Manual testing** with screen readers (NVDA + Firefox, VoiceOver + Safari) is still required before a release; automated tools find only part of all issues.
