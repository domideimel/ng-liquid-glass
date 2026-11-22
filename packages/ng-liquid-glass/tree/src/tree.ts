import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, ElementRef, inject, input, model, signal } from '@angular/core';
import { LgTypeahead, lgUniqueId } from '@domideimel/ng-liquid-glass';

/** A node of `lg-tree`. `value` identifies it and must be unique in the tree. */
export interface LgTreeNode<T = string> {
  readonly label: string;
  readonly value: T;
  readonly children?: readonly LgTreeNode<T>[];
}

interface VisibleNode<T> {
  readonly node: LgTreeNode<T>;
  readonly parent: LgTreeNode<T> | null;
}

/**
 * A hierarchical list with single selection (WAI-ARIA tree view pattern), e.g. folders or a table of
 * contents. One Tab stop; Up/Down move, Right expands or enters a node, Left collapses or goes to the
 * parent (mirrored right-to-left), Home/End, typing jumps to a label, Enter or Space selects.
 *
 * @example
 * <lg-tree label="Files" [nodes]="files" [(value)]="selected" [(expanded)]="open" />
 */
@Component({
  selector: 'lg-tree',
  imports: [NgTemplateOutlet],
  host: { class: 'block text-lg-fg' },
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/interactive-supports-focus -- keys come from the focused treeitems (roving tabindex) -->
    <ul role="tree" class="m-0 list-none p-0" [attr.aria-label]="label()" (keydown)="onKeydown($event)">
      <ng-container [ngTemplateOutlet]="level" [ngTemplateOutletContext]="{ $implicit: nodes(), depth: 1 }" />
    </ul>
    <ng-template #level let-nodes let-depth="depth">
      @for (node of nodes; track node.value; let i = $index) {
        <li
          role="treeitem"
          class="outline-none"
          [id]="itemId(node)"
          [attr.aria-level]="depth"
          [attr.aria-setsize]="nodes.length"
          [attr.aria-posinset]="i + 1"
          [attr.aria-expanded]="hasChildren(node) ? isExpanded(node) : null"
          [attr.aria-selected]="isSelected(node)"
          [tabindex]="isFocused(node) ? 0 : -1"
          (focus)="focused.set(node.value)"
        >
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -- the treeitem handles the keyboard -->
          <span
            class="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg-control pe-3 hover:bg-lg-surface-muted [li:focus-visible>&]:outline-3 [li:focus-visible>&]:outline-offset-[-3px] [li:focus-visible>&]:outline-lg-focus [li[aria-selected=true]>&]:bg-lg-primary [li[aria-selected=true]>&]:text-lg-on-primary [li[aria-selected=true]>&]:lg-forced-selected"
            [style.padding-inline-start.rem]="0.25 + (depth - 1) * 1.25"
            (click)="onClick(node)"
          >
            @if (hasChildren(node)) {
              <svg
                aria-hidden="true"
                class="shrink-0 transition-transform rtl:-scale-x-100"
                [class]="isExpanded(node) ? 'rotate-90 rtl:-rotate-90' : ''"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            } @else {
              <span aria-hidden="true" class="w-4 shrink-0"></span>
            }
            {{ node.label }}
          </span>
          @if (hasChildren(node) && isExpanded(node)) {
            <ul role="group" class="m-0 list-none p-0">
              <ng-container [ngTemplateOutlet]="level" [ngTemplateOutletContext]="{ $implicit: node.children, depth: depth + 1 }" />
            </ul>
          }
        </li>
      }
    </ng-template>
  `,
})
export class LgTree<T = string> {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly nodes = input.required<readonly LgTreeNode<T>[]>();
  /** Accessible name of the tree. */
  readonly label = input.required<string>();
  /** The selected node's value. */
  readonly value = model<T | null>(null);
  /** Values of the expanded nodes. */
  readonly expanded = model<readonly T[]>([]);

  private readonly id = lgUniqueId('lg-tree');
  protected readonly focused = signal<T | null>(null);
  private readonly typeahead = new LgTypeahead();

  /** Nodes in display order, skipping children of collapsed nodes. */
  private readonly visible = computed(() => {
    const expanded = new Set(this.expanded());
    const result: VisibleNode<T>[] = [];
    const walk = (nodes: readonly LgTreeNode<T>[], parent: LgTreeNode<T> | null): void => {
      for (const node of nodes) {
        result.push({ node, parent });
        if (node.children && expanded.has(node.value)) walk(node.children, node);
      }
    };
    walk(this.nodes(), null);
    return result;
  });

  /** The Tab stop: the focused node, else the selected one if visible, else the first. */
  private readonly tabStop = computed(() => {
    const visible = this.visible();
    const has = (value: T | null): boolean => value !== null && visible.some((entry) => entry.node.value === value);
    const focused = this.focused();
    if (has(focused)) return focused;
    const selected = this.value();
    return has(selected) ? selected : (visible[0]?.node.value ?? null);
  });

  private readonly ids = new Map<T, string>();

  /** A stable element id per node value. */
  protected itemId(node: LgTreeNode<T>): string {
    let id = this.ids.get(node.value);
    if (id === undefined) {
      id = `${this.id}-${String(this.ids.size)}`;
      this.ids.set(node.value, id);
    }
    return id;
  }

  protected hasChildren(node: LgTreeNode<T>): boolean {
    return (node.children?.length ?? 0) > 0;
  }

  protected isExpanded(node: LgTreeNode<T>): boolean {
    return this.expanded().includes(node.value);
  }

  protected isSelected(node: LgTreeNode<T>): boolean {
    return this.value() === node.value;
  }

  protected isFocused(node: LgTreeNode<T>): boolean {
    return this.tabStop() === node.value;
  }

  protected onClick(node: LgTreeNode<T>): void {
    this.value.set(node.value);
    if (this.hasChildren(node)) this.setExpanded(node, !this.isExpanded(node));
    this.focus(node);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const visible = this.visible();
    const index = visible.findIndex((entry) => entry.node.value === this.tabStop());
    const current = visible[index];
    if (!current) return;
    const { node, parent } = current;
    const rtl = getComputedStyle(this.element).direction === 'rtl';
    const key = rtl && event.key === 'ArrowLeft' ? 'ArrowRight' : rtl && event.key === 'ArrowRight' ? 'ArrowLeft' : event.key;
    switch (key) {
      case 'ArrowDown':
        this.focus(visible[index + 1]?.node);
        break;
      case 'ArrowUp':
        this.focus(visible[index - 1]?.node);
        break;
      case 'Home':
        this.focus(visible[0]?.node);
        break;
      case 'End':
        this.focus(visible.at(-1)?.node);
        break;
      case 'ArrowRight':
        if (!this.hasChildren(node)) break;
        if (this.isExpanded(node)) this.focus(node.children?.[0]);
        else this.setExpanded(node, true);
        break;
      case 'ArrowLeft':
        if (this.hasChildren(node) && this.isExpanded(node)) this.setExpanded(node, false);
        else this.focus(parent ?? undefined);
        break;
      case 'Enter':
      case ' ':
        this.value.set(node.value);
        break;
      default:
        if (!this.search(event, visible, index)) return;
    }
    event.preventDefault();
  }

  private setExpanded(node: LgTreeNode<T>, expanded: boolean): void {
    const others = this.expanded().filter((value) => value !== node.value);
    this.expanded.set(expanded ? [...others, node.value] : others);
  }

  private focus(node: LgTreeNode<T> | undefined): void {
    if (!node) return;
    this.focused.set(node.value);
    // Every node keyboard focus can reach is visible, so it is already rendered.
    this.element.ownerDocument.getElementById(this.itemId(node))?.focus();
  }

  /** Type-ahead: focuses the next visible node whose label starts with the typed characters. */
  private search(event: KeyboardEvent, visible: readonly VisibleNode<T>[], index: number): boolean {
    const match = this.typeahead.match(
      event,
      visible.map((entry) => entry.node.label),
      index,
    );
    if (match === null) return false;
    this.focus(visible[match]?.node);
    return true;
  }
}
