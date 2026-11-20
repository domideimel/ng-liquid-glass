import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('combobox: type, pick with the keyboard and get the result announced', async ({ page }) => {
  await page.goto('components/combobox');
  const combobox = page.getByRole('combobox', { name: 'Language' });
  await combobox.fill('sp');
  await expect(page.getByText('1 result available')).toBeAttached();
  await combobox.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'Spanish' })).toHaveAttribute('aria-selected', 'true');
  await combobox.press('Enter');
  await expect(combobox).toHaveValue('Spanish');
  await expect(combobox).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Selected: es')).toBeVisible();
});

test('combobox: the list is not clipped by its container', async ({ page }) => {
  await page.goto('components/combobox');
  await page.getByRole('combobox', { name: 'Language' }).press('ArrowDown');
  const last = page.getByRole('option', { name: 'Portuguese' });
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
});

test('dialog: keeps focus out of the page, closes with Escape and restores focus', async ({ page }) => {
  await page.goto('components/dialog');
  const opener = page.getByRole('button', { name: 'Delete project' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Delete “Website relaunch”?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab');
    // The page behind a modal is inert; the browser may move focus to its own UI (body) between cycles.
    expect(await dialog.evaluate((el) => el.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('menu: opens with the keyboard and returns focus on Escape', async ({ page }) => {
  await page.goto('components/menu');
  const trigger = page.getByRole('button', { name: 'Actions' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Last action: Delete')).toBeVisible();
  await expect(trigger).toBeFocused();
});

test('tabs: arrow keys move between tabs', async ({ page }) => {
  await page.goto('components/tabs');
  await page.getByRole('tab', { name: 'Profile' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Security' })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Security' })).toBeVisible();
});

test('tooltip: appears on focus and hides on Escape', async ({ page }) => {
  await page.goto('components/tooltip');
  const button = page.getByRole('button', { name: 'Copy link', exact: true }).and(page.locator('[lgtooltip]'));
  await button.focus();
  const tooltip = page.getByRole('tooltip', { name: 'Copies the link to your clipboard' });
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
});

test('skip link: is the first focusable element and becomes visible', async ({ page }) => {
  await page.goto('guides/getting-started');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
});

test('tabs: only the selected panel is shown', async ({ page }) => {
  await page.goto('components/tabs');
  const panels = page.locator('.ng-doc-demo-frame [role=tabpanel]');
  await expect(panels.first()).toBeVisible();
  await expect(panels.filter({ visible: true })).toHaveCount(1);
  await page.getByRole('tab', { name: 'Security' }).click();
  await expect(panels.filter({ visible: true })).toHaveCount(1);
  await expect(page.getByText('Passkeys, two-factor authentication and sessions.')).toBeVisible();
});
