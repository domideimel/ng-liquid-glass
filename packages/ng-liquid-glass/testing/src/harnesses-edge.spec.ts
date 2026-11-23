import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LgAccordionItem } from '@domideimel/ng-liquid-glass/accordion';
import { LgAlert } from '@domideimel/ng-liquid-glass/alert';
import { LgCombobox } from '@domideimel/ng-liquid-glass/combobox';
import { LgDialog } from '@domideimel/ng-liquid-glass/dialog';
import { LgFormField, LgInput } from '@domideimel/ng-liquid-glass/forms';
import { LgMenu, LgMenuItem, LgMenuTrigger } from '@domideimel/ng-liquid-glass/menu';
import { LgPagination } from '@domideimel/ng-liquid-glass/pagination';
import { LgTab, LgTabPanel, LgTabs } from '@domideimel/ng-liquid-glass/tabs';
import {
  LgAccordionItemHarness,
  LgAlertHarness,
  LgComboboxHarness,
  LgDialogHarness,
  LgFormFieldHarness,
  LgMenuHarness,
  LgPaginationHarness,
  LgTabsHarness,
} from './harnesses';

@Component({
  imports: [
    LgAccordionItem,
    LgAlert,
    LgCombobox,
    LgDialog,
    LgFormField,
    LgInput,
    LgMenu,
    LgMenuItem,
    LgMenuTrigger,
    LgPagination,
    LgTab,
    LgTabPanel,
    LgTabs,
  ],
  template: `
    <details lgAccordionItem open>
      <summary>Open already</summary>
      <p>Body</p>
    </details>
    <lg-alert status="info">No heading here.</lg-alert>
    <label for="fruit">Fruit</label>
    <lg-combobox [options]="['Apple', 'Banana']" />
    <lg-dialog [open]="true"><p>No title, no close button</p></lg-dialog>
    <lg-form-field><input lgInput aria-label="Unlabelled field" /></lg-form-field>
    <button type="button" [lgMenuTrigger]="menu">Menu</button>
    <lg-menu #menu><button lgMenuItem type="button">Only item</button></lg-menu>
    <lg-pagination pageCount="0" />
    <lg-tabs label="Letters"
      ><button lgTab type="button" value="a">A</button>
      <div lgTabPanel value="a">A panel</div></lg-tabs
    >
  `,
})
class EdgeHost {}

async function setup() {
  const fixture = TestBed.createComponent(EdgeHost);
  const loader = TestbedHarnessEnvironment.loader(fixture);
  await fixture.whenStable();
  return loader;
}

describe('testing harnesses (edge cases)', () => {
  it('handles missing optional parts and no-op actions', async () => {
    const loader = await setup();
    const item = await loader.getHarness(LgAccordionItemHarness);
    await item.expand();
    expect(await item.isExpanded()).toBe(true);
    await item.collapse();
    await item.collapse();
    expect(await item.isExpanded()).toBe(false);

    expect(await (await loader.getHarness(LgAlertHarness)).getHeading()).toBe('');
    expect(await (await loader.getHarness(LgFormFieldHarness)).getLabel()).toBe('');
    expect(await (await loader.getHarness(LgPaginationHarness)).getCurrentPage()).toBe(0);
    const tabs = await loader.getHarness(LgTabsHarness);
    expect(await tabs.getLabel()).toBe('Letters');
    expect(await (await tabs.getSelectedTab())?.getLabel()).toBe('A');

    const combobox = await loader.getHarness(LgComboboxHarness);
    await combobox.open();
    await combobox.open();
    expect(await combobox.isOpen()).toBe(true);
  });

  it('throws helpful errors for missing targets', async () => {
    const loader = await setup();
    const dialog = await loader.getHarness(LgDialogHarness);
    expect(await dialog.getTitle()).toBe('');
    await expect(dialog.close()).rejects.toThrow('no lgDialogClose button');

    const menu = await loader.getHarness(LgMenuHarness);
    await menu.close();
    expect(await menu.isOpen()).toBe(false);
    await expect(menu.clickItem({ text: 'Missing' })).rejects.toThrow('no item matching');
    await menu.close();
    expect(await menu.isOpen()).toBe(false);

    const pagination = await loader.getHarness(LgPaginationHarness);
    await expect(pagination.goToPage(3)).rejects.toThrow('Page 3 is not shown');
    const combobox = await loader.getHarness(LgComboboxHarness);
    await expect(combobox.selectOption('Cherry')).rejects.toThrow('no option matching');
  });
});
