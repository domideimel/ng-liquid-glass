import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgTree, type LgTreeNode } from './tree';

const FILES: LgTreeNode[] = [
  {
    label: 'src',
    value: 'src',
    children: [
      { label: 'app', value: 'src/app', children: [{ label: 'main.ts', value: 'src/app/main.ts' }] },
      { label: 'styles.css', value: 'src/styles.css' },
    ],
  },
  { label: 'package.json', value: 'package.json' },
  { label: 'README.md', value: 'README.md' },
];

async function setup(expanded: string[] = []) {
  const value = signal<string | null>(null);
  const open = signal<readonly string[]>(expanded);
  await render(`<lg-tree label="Files" [nodes]="nodes" [(value)]="value" [(expanded)]="open" />`, {
    imports: [LgTree],
    componentProperties: { nodes: FILES, value, open },
  });
  return { value, open, item: (name: string) => screen.getByRole('treeitem', { name: new RegExp(`^${name.replace('.', '\\.')}`) }) };
}

describe('LgTree', () => {
  it('renders a tree with levels, positions and one tab stop', async () => {
    const { item } = await setup(['src']);
    expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
    expect(item('src')).toHaveAttribute('aria-expanded', 'true');
    expect(item('src')).toHaveAttribute('aria-level', '1');
    expect(item('app')).toHaveAttribute('aria-level', '2');
    expect(item('app')).toHaveAttribute('aria-posinset', '1');
    expect(item('app')).toHaveAttribute('aria-setsize', '2');
    expect(item('package.json')).not.toHaveAttribute('aria-expanded');
    expect(item('src')).toHaveAttribute('tabindex', '0');
    expect(item('app')).toHaveAttribute('tabindex', '-1');
    expect(screen.queryByRole('treeitem', { name: 'main.ts' })).toBeNull();
    await expectNoA11yViolations();
  });

  it('moves, expands and collapses with the arrow keys', async () => {
    const { item, open } = await setup();
    item('src').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(open()).toEqual(['src']);
    expect(item('src')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(item('app')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(item('main.ts')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(item('main.ts')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(item('styles.css')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
    expect(item('app')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(item('app')).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{ArrowLeft}');
    expect(item('src')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(open()).toEqual([]);
    await userEvent.keyboard('{End}');
    expect(item('README.md')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Home}');
    expect(item('src')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
    expect(item('src')).toHaveFocus();
  });

  it('selects with Enter, Space and clicks', async () => {
    const { item, value, open } = await setup();
    item('src').focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(value()).toBe('package.json');
    expect(item('package.json')).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown} ');
    expect(value()).toBe('README.md');
    // A click on the label selects without toggling; the arrow and a double-click toggle.
    await userEvent.click(screen.getByText('src'));
    expect(value()).toBe('src');
    expect(open()).toEqual([]);
    expect(item('src')).toHaveFocus();
    const arrow = item('src').querySelector<HTMLElement>('[data-lg-part="toggle"]')!;
    await userEvent.click(arrow);
    expect(open()).toEqual(['src']);
    expect(value()).toBe('src');
    await userEvent.dblClick(screen.getByText('src'));
    expect(open()).toEqual([]);
    await userEvent.dblClick(screen.getByText('README.md'));
    expect(value()).toBe('README.md');
    await expectNoA11yViolations();
  });

  it('jumps by typing and ignores other keys', async () => {
    const { item } = await setup(['src']);
    item('src').focus();
    await userEvent.keyboard('r');
    expect(item('README.md')).toHaveFocus();
    await userEvent.keyboard('{Control>}s{/Control}');
    expect(item('README.md')).toHaveFocus();
    await userEvent.keyboard('{Tab}');
    expect(document.body).toHaveFocus();
  });

  it('mirrors left and right in a right-to-left layout', async () => {
    const { item, open } = await setup();
    document.documentElement.dir = 'rtl';
    try {
      item('src').focus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(open()).toEqual(['src']);
      await userEvent.keyboard('{ArrowRight}');
      expect(open()).toEqual([]);
    } finally {
      document.documentElement.dir = '';
    }
  });

  it('keeps the tab stop on the selected node', async () => {
    const value = signal<string | null>('README.md');
    await render(`<lg-tree label="Files" [nodes]="nodes" [(value)]="value" />`, {
      imports: [LgTree],
      componentProperties: { nodes: FILES, value },
    });
    expect(screen.getByRole('treeitem', { name: 'README.md' })).toHaveAttribute('tabindex', '0');
  });
});
