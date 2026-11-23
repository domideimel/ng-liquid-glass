import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { DEMO_PAGES } from './pages';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function openDemoPage(
  page: Page,
  path: string,
  options: { rtl?: boolean; theme?: 'light' | 'dark'; forcedColors?: boolean } = {},
): Promise<void> {
  const theme = options.theme ?? 'light';
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce', forcedColors: options.forcedColors ? 'active' : 'none' });
  await page.goto(path);
  await page.evaluate((mode) => {
    document.documentElement.setAttribute('data-theme', mode);
  }, theme);
  await expect(page.locator('ng-doc-demo').first()).toBeVisible();
  // Mirror the demos only: the docs site around them isn't built for right-to-left.
  if (options.rtl) {
    await page.locator('.ng-doc-demo-frame').evaluateAll((frames) => {
      for (const frame of frames) frame.setAttribute('dir', 'rtl');
    });
  }
}

test.describe('right-to-left', () => {
  for (const path of DEMO_PAGES) {
    test(`${path} demos have no WCAG violations and stay inside their frame`, async ({ page }) => {
      await openDemoPage(page, path, { rtl: true });
      const results = await new AxeBuilder({ page }).include('.ng-doc-demo-frame').withTags(TAGS).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      // A physical left/right property would push content out of the frame when mirrored.
      const overflowing = await page
        .locator('.ng-doc-demo-frame')
        .evaluateAll((frames) =>
          frames.filter((frame) => frame.scrollWidth > frame.clientWidth + 1).map((frame) => frame.innerHTML.slice(0, 80)),
        );
      expect(overflowing).toEqual([]);
    });
  }
});

test.describe('forced colors (Windows High Contrast)', () => {
  // Playwright emulates forced colors in Chromium only.
  // eslint-disable-next-line playwright/no-skipped-test -- conditional skip by browser, not a disabled test
  test.skip(({ browserName }) => browserName !== 'chromium');

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  });

  /** Backgrounds are replaced by the system palette, so a selected state must use the system Highlight colour. */
  async function expectHighlighted(page: Page, selector: string): Promise<void> {
    await expect(page.locator(selector).first()).toBeVisible();
    const [highlight, selected] = await page.evaluate((sel) => {
      const probe = document.createElement('div');
      probe.style.cssText = 'forced-color-adjust: none; background-color: Highlight';
      document.body.append(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      const element = document.querySelector(sel);
      return [color, element ? getComputedStyle(element).backgroundColor : 'missing'];
    }, selector);
    expect(selected).toBe(highlight);
  }

  test('the selected tab is highlighted', async ({ page }) => {
    await page.goto('components/tabs');
    await expectHighlighted(page, '.ng-doc-demo-frame [role=tab][aria-selected=true]');
  });

  test('the current page is highlighted', async ({ page }) => {
    await page.goto('components/pagination');
    await expectHighlighted(page, '.ng-doc-demo-frame button[aria-current=page]');
  });

  test('the active combobox option is highlighted', async ({ page }) => {
    await page.goto('components/combobox');
    await page.getByRole('combobox', { name: 'Language' }).press('ArrowDown');
    await expectHighlighted(page, '[role=option][aria-selected=true]');
  });
});

// Screenshots are compared against the base branch's rendering in CI's Linux Chromium, so they only run there.
// Baselines are CI artifacts, not files in git; see CONTRIBUTING.md, "Visual changes".
test.describe('visual regression', () => {
  // eslint-disable-next-line playwright/no-skipped-test -- conditional skip by browser and environment
  test.skip(({ browserName }) => browserName !== 'chromium' || !process.env['CI'], 'Chromium in CI only');

  const variants = [
    // Dark mode is covered by axe's contrast checks in both themes; a screenshot adds little.
    { name: 'light', theme: 'light' as const },
    { name: 'rtl', theme: 'light' as const, rtl: true },
    { name: 'forced-colors', theme: 'light' as const, forcedColors: true },
  ];

  for (const path of DEMO_PAGES) {
    for (const variant of variants) {
      test(`${path} (${variant.name})`, async ({ page }) => {
        await openDemoPage(page, path, variant);
        await page.evaluate(() => document.fonts.ready);
        const demos = page.locator('.ng-doc-demo-frame');
        // Named after the demo component (e.g. docs-sheet-demo), not its position, so adding a demo to a
        // page doesn't rename the screenshots of the others.
        const names = await demos.evaluateAll((frames) => frames.map((frame) => frame.firstElementChild?.localName ?? 'demo'));
        for (const [index, name] of names.entries()) {
          await expect(demos.nth(index)).toHaveScreenshot(`${name}-${variant.name}.png`, {
            animations: 'disabled',
            caret: 'hide',
            maxDiffPixelRatio: 0.01,
          });
        }
      });
    }
  }
});
