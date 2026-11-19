import axe from 'axe-core';

/**
 * Runs axe-core against the rendered DOM with every WCAG 2.x A/AA rule plus best practices.
 * Colour contrast and target size are verified separately against the compiled theme in the docs e2e suite
 * (WCAG AAA enhanced contrast), because unit tests run without the Tailwind stylesheet.
 */
export async function expectNoA11yViolations(context: Element = document.body): Promise<void> {
  const result = await axe.run(context, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    rules: {
      'color-contrast': { enabled: false },
      'target-size': { enabled: false },
      region: { enabled: false },
      'landmark-one-main': { enabled: false },
      'page-has-heading-one': { enabled: false },
    },
  });
  const violations = result.violations.map((v) => `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  expect(violations).toEqual([]);
}
