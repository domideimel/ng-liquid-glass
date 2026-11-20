import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required } from '@angular/forms/signals';
import { LgAccordionItem } from '@domideimel/ng-liquid-glass/accordion';
import { LgAlert } from '@domideimel/ng-liquid-glass/alert';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgCombobox } from '@domideimel/ng-liquid-glass/combobox';
import { LgDialog, LgDialogClose, LgDialogTitle } from '@domideimel/ng-liquid-glass/dialog';
import { LgFormField, LgHint, LgInput, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { LgMenu, LgMenuItem, LgMenuTrigger } from '@domideimel/ng-liquid-glass/menu';
import { LgPagination } from '@domideimel/ng-liquid-glass/pagination';
import { LgTab, LgTabPanel, LgTabs } from '@domideimel/ng-liquid-glass/tabs';
import { LgToaster, LgToasterRegion } from '@domideimel/ng-liquid-glass/toast';
import {
  LgAccordionItemHarness,
  LgAlertHarness,
  LgButtonHarness,
  LgComboboxHarness,
  LgDialogHarness,
  LgFormFieldHarness,
  LgMenuHarness,
  LgPaginationHarness,
  LgTabsHarness,
  LgToastHarness,
} from './harnesses';

@Component({
  imports: [
    LgAccordionItem,
    LgAlert,
    LgButton,
    LgCombobox,
    LgDialog,
    LgDialogClose,
    LgDialogTitle,
    LgFormField,
    LgHint,
    LgInput,
    LgLabel,
    FormField,
    LgMenu,
    LgMenuItem,
    LgMenuTrigger,
    LgPagination,
    LgTab,
    LgTabPanel,
    LgTabs,
    LgToasterRegion,
  ],
  template: `
    <button lgButton variant="primary" type="button" (click)="clicks.set(clicks() + 1)">Save</button>
    <button lgButton type="button" [loading]="true">Busy</button>
    <button lgButton type="button" (click)="dialogOpen.set(true)">Open dialog</button>

    <lg-tabs label="Settings" [(value)]="tab">
      <button lgTab type="button" value="profile">Profile</button>
      <button lgTab type="button" value="security">Security</button>
      <div lgTabPanel value="profile">Profile panel</div>
      <div lgTabPanel value="security">Security panel</div>
    </lg-tabs>

    <lg-form-field>
      <label lgLabel>Language</label>
      <lg-combobox [options]="languages" [(value)]="language" />
    </lg-form-field>

    <lg-form-field>
      <label lgLabel>Email</label>
      <lg-hint>We never share it.</lg-hint>
      <input lgInput type="email" [formField]="account.email" />
    </lg-form-field>

    <button lgButton type="button" [lgMenuTrigger]="menu">Options</button>
    <lg-menu #menu>
      <button lgMenuItem type="button" (click)="picked.set('edit')">Edit</button>
      <button lgMenuItem type="button" (click)="picked.set('delete')">Delete</button>
    </lg-menu>

    <lg-pagination pageCount="10" [(page)]="page" />

    <details lgAccordionItem>
      <summary>Shipping</summary>
      <p>Two days.</p>
    </details>

    <lg-alert status="success" heading="Saved">Your changes are live.</lg-alert>

    <lg-dialog [(open)]="dialogOpen">
      <h2 lgDialogTitle>Delete project?</h2>
      <button lgButton type="button" lgDialogClose>Cancel</button>
    </lg-dialog>

    <lg-toaster />
  `,
})
class Host {
  readonly clicks = signal(0);
  readonly tab = signal('profile');
  readonly languages = ['English', 'German', 'Spanish'];
  readonly language = signal<string | null>(null);
  readonly picked = signal('');
  readonly page = signal(1);
  readonly dialogOpen = signal(false);
  readonly account = form(signal({ email: '' }), (path) => {
    required(path.email, { message: 'Enter your email' });
  });
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  const loader = TestbedHarnessEnvironment.loader(fixture);
  await fixture.whenStable();
  return { fixture, host: fixture.componentInstance, loader };
}

describe('testing harnesses', () => {
  it('button: text, click, loading and disabled state', async () => {
    const { host, loader } = await setup();
    const save = await loader.getHarness(LgButtonHarness.with({ text: 'Save' }));
    await save.click();
    expect(host.clicks()).toBe(1);
    expect(await save.isDisabled()).toBe(false);
    const busy = await loader.getHarness(LgButtonHarness.with({ text: 'Busy' }));
    expect(await busy.isLoading()).toBe(true);
    expect(await busy.isDisabled()).toBe(true);
  });

  it('tabs: selected tab, select by label, visible panel', async () => {
    const { host, loader } = await setup();
    const tabs = await loader.getHarness(LgTabsHarness.with({ text: 'Settings' }));
    expect(await (await tabs.getSelectedTab())?.getLabel()).toBe('Profile');
    await tabs.selectTab({ text: 'Security' });
    expect(host.tab()).toBe('security');
    expect(await tabs.getPanelText()).toBe('Security panel');
    expect(await tabs.getTabs()).toHaveLength(2);
  });

  it('combobox: type, list suggestions and pick one', async () => {
    const { host, loader } = await setup();
    const combobox = await loader.getHarness(LgComboboxHarness);
    await combobox.enterText('an');
    expect(await combobox.isOpen()).toBe(true);
    expect(await combobox.getOptions()).toEqual(['German', 'Spanish']);
    await combobox.selectOption('Spanish');
    expect(await combobox.getValue()).toBe('Spanish');
    expect(host.language()).toBe('Spanish');
    expect(await combobox.isDisabled()).toBe(false);
  });

  it('form field: label, hints and errors', async () => {
    const { host, fixture, loader } = await setup();
    const field = await loader.getHarness(LgFormFieldHarness.with({ text: 'Email' }));
    expect(await field.getLabel()).toBe('Email');
    expect(await field.getHints()).toEqual(['We never share it.']);
    expect(await field.isRequired()).toBe(true);
    expect(await field.getErrors()).toEqual([]);
    host.account.email().markAsTouched();
    await fixture.whenStable();
    expect(await field.isInvalid()).toBe(true);
    expect(await field.getErrors()).toEqual(['Enter your email']);
  });

  it('menu: open, list and click items', async () => {
    const { host, loader } = await setup();
    const menu = await loader.getHarness(LgMenuHarness.with({ text: 'Options' }));
    expect(await menu.isOpen()).toBe(false);
    const items = await menu.getItems();
    expect(await menu.isOpen()).toBe(true);
    expect(await Promise.all(items.map((item) => item.getText()))).toEqual(['Edit', 'Delete']);
    await menu.clickItem({ text: 'Delete' });
    expect(host.picked()).toBe('delete');
    expect(await menu.isOpen()).toBe(false);
  });

  it('pagination: current page, go to a page, next and previous', async () => {
    const { host, loader } = await setup();
    const pagination = await loader.getHarness(LgPaginationHarness);
    expect(await pagination.getCurrentPage()).toBe(1);
    expect(await pagination.isPreviousDisabled()).toBe(true);
    await pagination.next();
    expect(host.page()).toBe(2);
    await pagination.goToPage(3);
    expect(await pagination.getCurrentPage()).toBe(3);
    await pagination.previous();
    expect(host.page()).toBe(2);
    expect(await pagination.isNextDisabled()).toBe(false);
    expect(await pagination.getVisiblePages()).toContain(10);
  });

  it('accordion item: expand and collapse', async () => {
    const { loader } = await setup();
    const item = await loader.getHarness(LgAccordionItemHarness.with({ text: 'Shipping' }));
    expect(await item.isExpanded()).toBe(false);
    await item.expand();
    expect(await item.isExpanded()).toBe(true);
    await item.collapse();
    expect(await item.isExpanded()).toBe(false);
  });

  it('alert: heading and text', async () => {
    const { loader } = await setup();
    const alert = await loader.getHarness(LgAlertHarness.with({ text: 'Saved' }));
    expect(await alert.getText()).toContain('Your changes are live.');
  });

  it('dialog: open state, title, close', async () => {
    const { host, loader } = await setup();
    await (await loader.getHarness(LgButtonHarness.with({ text: 'Open dialog' }))).click();
    const dialog = await loader.getHarness(LgDialogHarness.with({ text: 'Delete project?' }));
    expect(await dialog.isOpen()).toBe(true);
    expect(await dialog.getText()).toContain('Cancel');
    await dialog.close();
    expect(host.dialogOpen()).toBe(false);
    expect(await dialog.isOpen()).toBe(false);
  });

  it('toast: message, action and dismiss', async () => {
    const { loader } = await setup();
    const toaster = TestBed.inject(LgToaster);
    let undone = false;
    toaster.show({
      message: 'File deleted',
      action: {
        label: 'Undo',
        run: () => {
          undone = true;
        },
      },
    });
    toaster.show({ message: 'Saved' });
    const deleted = await loader.getHarness(LgToastHarness.with({ text: 'File deleted' }));
    expect(await deleted.getActionLabel()).toBe('Undo');
    await deleted.clickAction();
    expect(undone).toBe(true);
    const saved = await loader.getHarness(LgToastHarness.with({ text: 'Saved' }));
    expect(await saved.getActionLabel()).toBeNull();
    await expect(saved.clickAction()).rejects.toThrow('no action');
    await saved.dismiss();
    expect(await loader.getAllHarnesses(LgToastHarness)).toHaveLength(0);
  });
});
