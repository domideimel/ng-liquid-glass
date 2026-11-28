import { expect, test, type Locator } from '@playwright/test';

/**
 * Safari and WebKit on macOS skip links and buttons on Tab unless "Press Tab to highlight each item" is on;
 * Option-Tab always reaches them, so press that there, as a Safari keyboard user would.
 */
const tabKey = (browserName: string) => (browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');

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

test('dialog: keeps focus out of the page, closes with Escape and restores focus', async ({ page, browserName }) => {
  await page.goto('components/dialog');
  const opener = page.getByRole('button', { name: 'Delete project' });
  // Open with the keyboard: macOS WebKit doesn't focus a clicked button, so there would be nothing to restore.
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Delete “Website relaunch”?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press(tabKey(browserName));
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

test('skip link: is the first focusable element and becomes visible', async ({ page, browserName }) => {
  await page.goto('guides/getting-started');
  await page.keyboard.press(tabKey(browserName));
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

/** A popup opened from `trigger` sits right next to it (CSS anchor positioning works in this browser). */
async function expectAnchoredTo(popup: Locator, trigger: Locator): Promise<void> {
  const [box, anchor] = await Promise.all([popup.boundingBox(), trigger.boundingBox()]);
  expect(box && anchor).toBeTruthy();
  if (!box || !anchor) return;
  const verticalGap = Math.min(Math.abs(box.y - (anchor.y + anchor.height)), Math.abs(anchor.y - (box.y + box.height)));
  expect(verticalGap).toBeLessThan(16);
  expect(Math.abs(box.x - anchor.x)).toBeLessThan(anchor.width);
}

test('select: open with the keyboard, pick an option, list anchored to the button', async ({ page }) => {
  await page.goto('components/select');
  const select = page.getByRole('combobox', { name: 'Plan' });
  await select.focus();
  await select.press('ArrowDown');
  await expect(select).toHaveAttribute('aria-expanded', 'true');
  await expectAnchoredTo(page.locator('[popover]:popover-open'), select);
  await select.press('ArrowDown');
  await select.press('Enter');
  await expect(select).toHaveAttribute('aria-expanded', 'false');
  await expect(select).toContainText('Pro');
  await expect(select).toBeFocused();
});

test('combobox: suggestion list anchored to the input', async ({ page }) => {
  await page.goto('components/combobox');
  const combobox = page.getByRole('combobox', { name: 'Language' });
  await combobox.press('ArrowDown');
  await expectAnchoredTo(page.locator('[popover]:popover-open'), combobox);
});

test('tree: arrow keys move, expand and select', async ({ page }) => {
  await page.goto('components/tree');
  const item = (name: string) => page.getByRole('treeitem', { name, exact: true });
  await item('main.ts').focus();
  await page.keyboard.press('ArrowUp');
  await expect(item('app')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(item('app')).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(item('app.ts')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Selected: src/app/app.ts')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(item('app')).toBeFocused();
});

test('toolbar: one tab stop, arrow keys between items', async ({ page }) => {
  await page.goto('components/toolbar');
  const toolbar = page.getByRole('toolbar', { name: 'Text formatting' });
  await toolbar.getByRole('button', { name: 'Bold' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(toolbar.getByRole('button', { name: 'Italic' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(toolbar.getByRole('button', { name: 'Link' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(toolbar.getByRole('button', { name: 'Bold' })).toBeFocused();
  await expect(toolbar.getByRole('button', { name: 'Italic' })).toHaveAttribute('tabindex', '-1');
});

test('popover: opens next to its trigger, moves focus in, Escape returns it', async ({ page }) => {
  await page.goto('components/popover');
  const trigger = page.getByRole('button', { name: /Filters/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Status' });
  await expect(dialog).toBeVisible();
  await expectAnchoredTo(dialog, trigger);
  await expect(dialog.getByRole('checkbox', { name: 'Open' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('tag input: Enter adds a tag, Backspace removes the last one', async ({ page }) => {
  await page.goto('components/tag');
  const input = page.getByRole('textbox', { name: 'Skills' });
  await input.fill('Testing');
  await input.press('Enter');
  await expect(page.getByRole('button', { name: 'Remove Testing' })).toBeVisible();
  await input.press('Backspace');
  await expect(page.getByRole('button', { name: 'Remove Testing' })).toHaveCount(0);
});

test('dialog and popover: a mouse click opener gets focus back, also where a click does not focus it (Safari)', async ({ page }) => {
  await page.goto('components/dialog');
  const opener = page.getByRole('button', { name: 'Delete project' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Delete “Website relaunch”?' });
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await page.goto('components/popover');
  const trigger = page.getByRole('button', { name: /Filters/ });
  await trigger.click();
  const popover = page.getByRole('dialog', { name: 'Status' });
  await expect(popover.getByRole('checkbox', { name: 'Open' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('segmented: the radio is the pointer target, so check() works', async ({ page }) => {
  await page.goto('components/segmented');
  const radios = page.getByRole('radio');
  const second = radios.nth(1);
  await second.check();
  await expect(second).toBeChecked();
  await radios.nth(0).click();
  await expect(radios.nth(0)).toBeChecked();
});

test('list: removing a row shows an inline undo with focus, Undo restores the row', async ({ page }) => {
  await page.goto('components/list');
  await page.getByRole('button', { name: 'Remove password 2' }).click();
  const undo = page.getByRole('button', { name: 'Undo' });
  await expect(undo).toBeFocused();
  await expect(undo).toHaveAccessibleDescription('Password 2 removed');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Remove password 2' })).toBeVisible();
});
