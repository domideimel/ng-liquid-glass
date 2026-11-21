import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LgPopover, LgPopoverTrigger } from '@domideimel/ng-liquid-glass/popover';
import { LgSelect } from '@domideimel/ng-liquid-glass/select';
import { LgTagInput } from '@domideimel/ng-liquid-glass/tag';
import { LgTree, type LgTreeNode } from '@domideimel/ng-liquid-glass/tree';
import { LgPopoverHarness, LgSelectHarness, LgTagInputHarness, LgTreeHarness } from './harnesses';

@Component({
  imports: [LgPopover, LgPopoverTrigger, LgSelect, LgTagInput, LgTree],
  template: `
    <label for="plan">Plan</label>
    <lg-select placeholder="Choose" [options]="plans" [(value)]="plan" />
    <label for="tags">Tags</label>
    <lg-tag-input [(value)]="tags" />
    <button type="button" [lgPopoverTrigger]="info">Info</button>
    <lg-popover #info label="Info">Version 2</lg-popover>
    <lg-tree label="Files" [nodes]="files" [(value)]="file" [(expanded)]="expanded" />
  `,
})
class Host {
  readonly plans = ['Free', 'Pro', 'Team'];
  readonly plan = signal<string | null>(null);
  readonly tags = signal<readonly string[]>(['a']);
  readonly files: LgTreeNode[] = [
    { label: 'src', value: 'src', children: [{ label: 'main.ts', value: 'main.ts' }] },
    { label: 'README.md', value: 'README.md' },
  ];
  readonly file = signal<string | null>(null);
  readonly expanded = signal<readonly string[]>([]);
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  const loader = TestbedHarnessEnvironment.loader(fixture);
  await fixture.whenStable();
  return { host: fixture.componentInstance, loader };
}

describe('testing harnesses (selection and disclosure)', () => {
  it('select: options, selection and value text', async () => {
    const { host, loader } = await setup();
    const select = await loader.getHarness(LgSelectHarness);
    expect(await select.getValueText()).toBe('Choose');
    expect(await select.getOptions()).toEqual(['Free', 'Pro', 'Team']);
    expect(await select.isOpen()).toBe(true);
    await select.selectOption('Pro');
    expect(host.plan()).toBe('Pro');
    expect(await select.getValueText()).toBe('Pro');
    expect(await select.isDisabled()).toBe(false);
    await expect(select.selectOption('Gold')).rejects.toThrow('no option');
  });

  it('tag input: add and remove tags', async () => {
    const { host, loader } = await setup();
    const tags = await loader.getHarness(LgTagInputHarness);
    await tags.addTag('b');
    expect(await tags.getTags()).toEqual(['a', 'b']);
    await tags.removeTag('a');
    expect(host.tags()).toEqual(['b']);
    await expect(tags.removeTag('z')).rejects.toThrow('no tag');
  });

  it('popover: toggle and read its content', async () => {
    const { loader } = await setup();
    const popover = await loader.getHarness(LgPopoverHarness.with({ text: 'Info' }));
    await popover.toggle();
    // The browser fires the popover's toggle event asynchronously.
    await expect.poll(() => popover.isOpen()).toBe(true);
    expect(await popover.getText()).toBe('Version 2');
  });

  it('tree: items, levels, expansion and selection', async () => {
    const { host, loader } = await setup();
    const tree = await loader.getHarness(LgTreeHarness.with({ text: 'Files' }));
    expect(await tree.getItems()).toHaveLength(2);
    const [src] = await tree.getItems({ text: 'src' });
    expect(await src?.isExpanded()).toBe(false);
    await src?.click();
    expect(host.expanded()).toEqual(['src']);
    const [main] = await tree.getItems({ text: 'main.ts' });
    expect(await main?.getLevel()).toBe(2);
    expect(await main?.isExpanded()).toBeNull();
    await main?.click();
    expect(await tree.getSelectedLabel()).toBe('main.ts');
    expect(host.file()).toBe('main.ts');
  });
});
