import { ComponentHarness, HarnessPredicate, type BaseHarnessFilters, type ComponentHarnessConstructor } from '@angular/cdk/testing';

/** Filters by the visible text of the harness's host (or its label/title, as documented per harness). */
export interface LgTextFilters extends BaseHarnessFilters {
  /** Text, or a pattern, the text must match. */
  text?: string | RegExp;
}

function withText<T extends ComponentHarness>(
  harness: ComponentHarnessConstructor<T>,
  options: LgTextFilters,
  getText: (harness: T) => Promise<string>,
): HarnessPredicate<T> {
  return new HarnessPredicate(harness, options).addOption('text', options.text, async (h, text) =>
    HarnessPredicate.stringMatches(getText(h), text),
  );
}

/** `button[lgButton]` / `a[lgButton]`. Filter by `text`. */
export class LgButtonHarness extends ComponentHarness {
  static hostSelector = '[lgButton]';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgButtonHarness> {
    return withText(LgButtonHarness, options, (h) => h.getText());
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async click(): Promise<void> {
    await (await this.host()).click();
  }

  /** Disabled natively, or through `aria-disabled` (links, loading buttons). */
  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getProperty<boolean | undefined>('disabled')) === true || (await host.getAttribute('aria-disabled')) === 'true';
  }

  async isLoading(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-busy')) === 'true';
  }
}

/** One tab of `lg-tabs`. Filter by `text` (the tab's label). */
export class LgTabHarness extends ComponentHarness {
  static hostSelector = '[role="tab"]';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgTabHarness> {
    return withText(LgTabHarness, options, (h) => h.getLabel());
  }

  async getLabel(): Promise<string> {
    return (await this.host()).text();
  }

  async isSelected(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-selected')) === 'true';
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getProperty<boolean | undefined>('disabled')) === true;
  }

  async select(): Promise<void> {
    await (await this.host()).click();
  }
}

/** `lg-tabs`. Filter by `text` (the tab list's accessible name). */
export class LgTabsHarness extends ComponentHarness {
  static hostSelector = 'lg-tabs';
  private readonly tablist = this.locatorFor('[role="tablist"]');

  static with(options: LgTextFilters = {}): HarnessPredicate<LgTabsHarness> {
    return withText(LgTabsHarness, options, (h) => h.getLabel());
  }

  async getLabel(): Promise<string> {
    return (await (await this.tablist()).getAttribute('aria-label')) ?? '';
  }

  async getTabs(filter: LgTextFilters = {}): Promise<LgTabHarness[]> {
    return this.locatorForAll(LgTabHarness.with(filter))();
  }

  async getSelectedTab(): Promise<LgTabHarness | null> {
    for (const tab of await this.getTabs()) {
      if (await tab.isSelected()) return tab;
    }
    return null;
  }

  async selectTab(filter: LgTextFilters): Promise<void> {
    await (await this.locatorFor(LgTabHarness.with(filter))()).select();
  }

  /** Text of the visible panel. */
  async getPanelText(): Promise<string> {
    const panels = await this.locatorForAll('[role="tabpanel"]')();
    for (const panel of panels) {
      if ((await panel.getProperty<boolean | undefined>('hidden')) !== true) return panel.text();
    }
    return '';
  }
}

/** `lg-combobox`. */
export class LgComboboxHarness extends ComponentHarness {
  static hostSelector = 'lg-combobox';
  private readonly input = this.locatorFor('input[role="combobox"]');

  async getValue(): Promise<string> {
    return (await this.input()).getProperty<string>('value');
  }

  async isOpen(): Promise<boolean> {
    return (await (await this.input()).getAttribute('aria-expanded')) === 'true';
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.input()).getProperty<boolean | undefined>('disabled')) === true;
  }

  /** Replaces the text, like a user typing it. */
  async enterText(text: string): Promise<void> {
    const input = await this.input();
    await input.clear();
    await input.sendKeys(text);
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.input()).click();
  }

  /** Texts of the suggestions currently shown. */
  async getOptions(): Promise<string[]> {
    const options = await this.locatorForAll('[role="option"]')();
    return Promise.all(options.map((option) => option.text()));
  }

  /** Opens the list if needed and clicks the first suggestion matching `text`. */
  async selectOption(text: string | RegExp): Promise<void> {
    await this.open();
    for (const option of await this.locatorForAll('[role="option"]')()) {
      if (await HarnessPredicate.stringMatches(option.text(), text)) {
        await option.click();
        return;
      }
    }
    throw new Error(`lg-combobox has no option matching ${String(text)}`);
  }

  async blur(): Promise<void> {
    await (await this.input()).blur();
  }
}

/** `lg-dialog`. Filter by `text` (the title). */
export class LgDialogHarness extends ComponentHarness {
  static hostSelector = 'lg-dialog';
  private readonly dialog = this.locatorFor('dialog');

  static with(options: LgTextFilters = {}): HarnessPredicate<LgDialogHarness> {
    return withText(LgDialogHarness, options, (h) => h.getTitle());
  }

  async isOpen(): Promise<boolean> {
    return (await (await this.dialog()).getProperty<boolean | undefined>('open')) === true;
  }

  async getTitle(): Promise<string> {
    return (await this.locatorForOptional('[lgDialogTitle]')())?.text() ?? '';
  }

  async getText(): Promise<string> {
    return (await this.dialog()).text();
  }

  /**
   * Closes through the dialog's `lgDialogClose` button. (A synthetic Escape key doesn't close a native
   * `<dialog>`; test Escape in an e2e test.)
   */
  async close(): Promise<void> {
    const button = await this.locatorForOptional('button[lgDialogClose]')();
    if (!button) throw new Error('The dialog has no lgDialogClose button');
    await button.click();
  }
}

/** One item of an `lg-menu`. Filter by `text`. */
export class LgMenuItemHarness extends ComponentHarness {
  static hostSelector = '[role="menuitem"]';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgMenuItemHarness> {
    return withText(LgMenuItemHarness, options, (h) => h.getText());
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getProperty<boolean | undefined>('disabled')) === true;
  }

  async click(): Promise<void> {
    await (await this.host()).click();
  }
}

/** A menu, located through its trigger (`button[lgMenuTrigger]`). Filter by `text` (the trigger's text). */
export class LgMenuHarness extends ComponentHarness {
  static hostSelector = 'button[aria-haspopup="menu"]';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgMenuHarness> {
    return withText(LgMenuHarness, options, (h) => h.getTriggerText());
  }

  async getTriggerText(): Promise<string> {
    return (await this.host()).text();
  }

  async isOpen(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.host()).click();
  }

  async close(): Promise<void> {
    if (await this.isOpen()) await (await this.host()).click();
  }

  /** The items of the menu (it opens first). */
  async getItems(filter: LgTextFilters = {}): Promise<LgMenuItemHarness[]> {
    await this.open();
    const menuId = await (await this.host()).getAttribute('aria-controls');
    return this.documentRootLocatorFactory().locatorForAll(LgMenuItemHarness.with({ ...filter, ancestor: `#${menuId ?? ''}` }))();
  }

  /** Opens the menu and clicks the first item matching `filter`. */
  async clickItem(filter: LgTextFilters): Promise<void> {
    const [item] = await this.getItems(filter);
    if (!item) throw new Error(`The menu has no item matching ${String(filter.text)}`);
    await item.click();
  }
}

/** `lg-pagination`. */
export class LgPaginationHarness extends ComponentHarness {
  static hostSelector = 'lg-pagination';

  async getCurrentPage(): Promise<number> {
    const current = await this.locatorForOptional('button[aria-current="page"]')();
    return current ? Number(await current.text()) : 0;
  }

  /** Page numbers currently shown (gaps excluded). */
  async getVisiblePages(): Promise<number[]> {
    const buttons = await this.locatorForAll('li:not(:first-child):not(:last-child) button')();
    const numbers = await Promise.all(buttons.map(async (button) => Number(await button.text())));
    return numbers.filter((page) => !Number.isNaN(page) && page > 0);
  }

  async goToPage(page: number): Promise<void> {
    for (const button of await this.locatorForAll('li button')()) {
      if ((await button.text()).trim() === String(page)) {
        await button.click();
        return;
      }
    }
    throw new Error(`Page ${String(page)} is not shown`);
  }

  async next(): Promise<void> {
    await (await this.locatorFor('li:last-child button')()).click();
  }

  async previous(): Promise<void> {
    await (await this.locatorFor('li:first-child button')()).click();
  }

  async isNextDisabled(): Promise<boolean> {
    return (await (await this.locatorFor('li:last-child button')()).getProperty<boolean | undefined>('disabled')) === true;
  }

  async isPreviousDisabled(): Promise<boolean> {
    return (await (await this.locatorFor('li:first-child button')()).getProperty<boolean | undefined>('disabled')) === true;
  }
}

/** `details[lgAccordionItem]`. Filter by `text` (the summary). */
export class LgAccordionItemHarness extends ComponentHarness {
  static hostSelector = 'details[lgAccordionItem]';
  private readonly summary = this.locatorFor('summary');

  static with(options: LgTextFilters = {}): HarnessPredicate<LgAccordionItemHarness> {
    return withText(LgAccordionItemHarness, options, (h) => h.getTitle());
  }

  async getTitle(): Promise<string> {
    return (await this.summary()).text();
  }

  async isExpanded(): Promise<boolean> {
    return (await (await this.host()).getProperty<boolean | undefined>('open')) === true;
  }

  async toggle(): Promise<void> {
    await (await this.summary()).click();
  }

  async expand(): Promise<void> {
    if (!(await this.isExpanded())) await this.toggle();
  }

  async collapse(): Promise<void> {
    if (await this.isExpanded()) await this.toggle();
  }
}

/** `lg-alert`. Filter by `text` (the heading). */
export class LgAlertHarness extends ComponentHarness {
  static hostSelector = 'lg-alert';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgAlertHarness> {
    return withText(LgAlertHarness, options, (h) => h.getHeading());
  }

  async getHeading(): Promise<string> {
    return (await this.locatorForOptional('p.font-semibold')())?.text() ?? '';
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}

/** One toast in `lg-toaster`. Filter by `text` (the message). */
export class LgToastHarness extends ComponentHarness {
  static hostSelector = 'lg-toast';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgToastHarness> {
    return withText(LgToastHarness, options, (h) => h.getMessage());
  }

  async getMessage(): Promise<string> {
    return (await this.locatorFor('p')()).text();
  }

  async getActionLabel(): Promise<string | null> {
    const buttons = await this.locatorForAll('button')();
    return buttons.length > 1 ? (buttons[0]?.text() ?? null) : null;
  }

  async clickAction(): Promise<void> {
    const buttons = await this.locatorForAll('button')();
    if (buttons.length < 2) throw new Error('The toast has no action');
    await buttons[0]?.click();
  }

  async dismiss(): Promise<void> {
    const buttons = await this.locatorForAll('button')();
    await buttons.at(-1)?.click();
  }
}

/** `lg-form-field`. Filter by `text` (the label). */
export class LgFormFieldHarness extends ComponentHarness {
  static hostSelector = 'lg-form-field';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgFormFieldHarness> {
    return withText(LgFormFieldHarness, options, (h) => h.getLabel());
  }

  /** The label text, without the required `*`. */
  async getLabel(): Promise<string> {
    const label = await this.locatorForOptional('label')();
    return label ? (await label.text()).replace(/\s*\*$/, '') : '';
  }

  async getHints(): Promise<string[]> {
    const hints = await this.locatorForAll('lg-hint')();
    return Promise.all(hints.map((hint) => hint.text()));
  }

  /** The error messages currently shown. */
  async getErrors(): Promise<string[]> {
    const errors = await this.locatorForAll('[aria-live] p, lg-error')();
    return Promise.all(errors.map((error) => error.text()));
  }

  async isRequired(): Promise<boolean> {
    return (await this.locatorForOptional('label span[aria-hidden="true"]')()) !== null;
  }

  async isInvalid(): Promise<boolean> {
    const control = await this.locatorForOptional('[aria-invalid="true"]')();
    return control !== null;
  }
}

/** `lg-select`. */
export class LgSelectHarness extends ComponentHarness {
  static hostSelector = 'lg-select';
  private readonly button = this.locatorFor('button[role="combobox"]');

  /** The selected option's text, or the placeholder. */
  async getValueText(): Promise<string> {
    return (await this.button()).text();
  }

  async isOpen(): Promise<boolean> {
    return (await (await this.button()).getAttribute('aria-expanded')) === 'true';
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.button()).getProperty<boolean | undefined>('disabled')) === true;
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.button()).click();
  }

  /** Main texts of the options (opens the list). */
  async getOptions(): Promise<string[]> {
    await this.open();
    const options = await this.locatorForAll('[role="option"] > span:first-child')();
    return Promise.all(options.map((option) => option.text()));
  }

  /** Opens the list and clicks the first option whose text matches. */
  async selectOption(text: string | RegExp): Promise<void> {
    await this.open();
    const options = await this.locatorForAll('[role="option"]')();
    const labels = await this.locatorForAll('[role="option"] > span:first-child')();
    for (const [index, label] of labels.entries()) {
      if (await HarnessPredicate.stringMatches(label.text(), text)) {
        await options[index]?.click();
        return;
      }
    }
    throw new Error(`lg-select has no option matching ${String(text)}`);
  }
}

/** `lg-tag-input`. */
export class LgTagInputHarness extends ComponentHarness {
  static hostSelector = 'lg-tag-input';
  private readonly input = this.locatorFor('input');

  async getTags(): Promise<string[]> {
    const tags = await this.locatorForAll('lg-tag span[id$="-text"]')();
    return Promise.all(tags.map((tag) => tag.text()));
  }

  /** Types the text and presses Enter. */
  async addTag(text: string): Promise<void> {
    const input = await this.input();
    await input.sendKeys(text);
    await input.dispatchEvent('keydown', { key: 'Enter' });
  }

  /** Clicks the remove button of the first tag with this text. */
  async removeTag(text: string): Promise<void> {
    const labels = await this.locatorForAll('lg-tag span[id$="-text"]')();
    const buttons = await this.locatorForAll('lg-tag button')();
    for (const [index, label] of labels.entries()) {
      if ((await label.text()) === text) {
        await buttons[index]?.click();
        return;
      }
    }
    throw new Error(`lg-tag-input has no tag "${text}"`);
  }
}

/** A popover, located through its trigger (`button[lgPopoverTrigger]`). Filter by `text` (the trigger's text). */
export class LgPopoverHarness extends ComponentHarness {
  static hostSelector = 'button[aria-haspopup="dialog"]';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgPopoverHarness> {
    return withText(LgPopoverHarness, options, (h) => h.getTriggerText());
  }

  async getTriggerText(): Promise<string> {
    return (await this.host()).text();
  }

  async isOpen(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-expanded')) === 'true';
  }

  /** Toggles the popover through its trigger. */
  async toggle(): Promise<void> {
    await (await this.host()).click();
  }

  /** Text content of the popover. */
  async getText(): Promise<string> {
    const id = await (await this.host()).getAttribute('aria-controls');
    return (await this.documentRootLocatorFactory().locatorFor(`#${id ?? ''}`)()).text();
  }
}

/** One node of `lg-tree`. Filter by `text` (its label). */
export class LgTreeItemHarness extends ComponentHarness {
  static hostSelector = '[role="treeitem"]';
  private readonly row = this.locatorFor(':scope > span');

  static with(options: LgTextFilters = {}): HarnessPredicate<LgTreeItemHarness> {
    return withText(LgTreeItemHarness, options, (h) => h.getLabel());
  }

  async getLabel(): Promise<string> {
    return (await this.row()).text();
  }

  async getLevel(): Promise<number> {
    return Number(await (await this.host()).getAttribute('aria-level'));
  }

  /** `null` for a node without children. */
  async isExpanded(): Promise<boolean | null> {
    const expanded = await (await this.host()).getAttribute('aria-expanded');
    return expanded === null ? null : expanded === 'true';
  }

  async isSelected(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-selected')) === 'true';
  }

  /** Selects the node and toggles it when it has children, like a click. */
  async click(): Promise<void> {
    await (await this.row()).click();
  }
}

/** `lg-tree`. Filter by `text` (its accessible name). */
export class LgTreeHarness extends ComponentHarness {
  static hostSelector = 'lg-tree';

  static with(options: LgTextFilters = {}): HarnessPredicate<LgTreeHarness> {
    return withText(LgTreeHarness, options, async (h) => (await (await h.locatorFor('[role="tree"]')()).getAttribute('aria-label')) ?? '');
  }

  /** The visible nodes, in order. */
  async getItems(filter: LgTextFilters = {}): Promise<LgTreeItemHarness[]> {
    return this.locatorForAll(LgTreeItemHarness.with(filter))();
  }

  async getSelectedLabel(): Promise<string | null> {
    for (const item of await this.getItems()) {
      if (await item.isSelected()) return item.getLabel();
    }
    return null;
  }
}
