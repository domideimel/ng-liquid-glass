import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { DEMO_PAGES } from './pages';
import { smallTargets } from './targets';

/** WCAG 2.0–2.2 A, AA and AAA, including enhanced contrast (7:1) and target size, against the real theme. */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function openDemoPage(page: Page, path: string, theme: 'light' | 'dark'): Promise<void> {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await page.goto(path);
  await page.evaluate((mode) => {
    document.documentElement.setAttribute('data-theme', mode);
  }, theme);
  await expect(page.locator('ng-doc-demo').first()).toBeVisible();
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} mode`, () => {
    for (const path of DEMO_PAGES) {
      test(`${path} demos have no WCAG violations`, async ({ page }) => {
        await openDemoPage(page, path, theme);
        const results = await new AxeBuilder({ page }).include('.ng-doc-demo-frame').withTags(TAGS).analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)).toEqual([]);
      });

      test(`${path} targets are at least 44 × 44 px (2.5.5 AAA)`, async ({ page }) => {
        await openDemoPage(page, path, theme);
        const tooSmall = await smallTargets(page, 44);
        expect(tooSmall).toEqual([]);
      });
    }
  });
}
