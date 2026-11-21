import { Component, contentChildren, Directive, ElementRef, forwardRef, inject, input, signal } from '@angular/core';
import { lgUniqueId } from '@domideimel/ng-liquid-glass';

/** An item of an `lg-menu`. Use a native `<button>` so Enter and Space activate it. */
@Directive({
  selector: 'button[lgMenuItem]',
  host: {
    type: 'button',
    role: 'menuitem',
    tabindex: '-1',
    class:
      'lg-focus-ring flex min-h-11 w-full cursor-pointer border border-transparent bg-transparent font-[inherit] text-base items-center gap-2 rounded-lg-control px-3 text-start text-lg-fg hover:bg-lg-surface-muted focus-visible:bg-lg-surface-muted disabled:cursor-not-allowed disabled:opacity-60',
    '(click)': 'menu.close()',
  },
})
export class LgMenuItem {
  protected readonly menu = inject<LgMenu>(forwardRef(() => LgMenu));
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
}

/**
 * A menu of actions (WAI-ARIA menu button pattern), shown in the top layer with the Popover API
 * and placed next to its trigger with CSS anchor positioning.
 *
 * @example
 * <button lgButton [lgMenuTrigger]="menu">Options</button>
 * <lg-menu #menu><button lgMenuItem (click)="edit()">Edit</button></lg-menu>
 */
@Component({
  selector: 'lg-menu',
  host: {
    role: 'menu',
    popover: 'auto',
    class:
      'lg-glass m-0 min-w-48 flex-col gap-0.5 rounded-lg-surface p-1 shadow-xl [inset:auto] [position-area:block-end_span-inline-end] [position-try-fallbacks:flip-block,flip-inline] open:flex',
    '[id]': 'id',
    '[attr.aria-labelledby]': 'triggerId()',
    '[style.position-anchor]': 'anchorName()',
    '(toggle)': 'onToggle($event)',
    '(keydown)': 'onKeydown($event)',
  },
  template: '<ng-content />',
})
export class LgMenu {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly items = contentChildren(LgMenuItem, { descendants: true });
  private trigger: HTMLElement | undefined;

  readonly id = lgUniqueId('lg-menu');
  readonly isOpen = signal(false);
  protected readonly triggerId = signal<string | null>(null);
  protected readonly anchorName = signal<string | null>(null);

  /** Opens the menu next to `trigger` and focuses its first or last item. */
  openFrom(trigger: HTMLElement, anchorName: string, focus: 'first' | 'last' = 'first'): void {
    this.trigger = trigger;
    this.triggerId.set(trigger.id);
    this.anchorName.set(anchorName);
    if (!this.isOpen()) {
      this.element.showPopover({ source: trigger });
      this.isOpen.set(true);
    }
    this.focusItem(focus === 'first' ? 0 : this.enabledItems().length - 1);
  }

  /** Closes the menu and returns focus to its trigger. */
  close(): void {
    this.hide();
    this.trigger?.focus();
  }

  protected onToggle(event: Event): void {
    this.isOpen.set((event as ToggleEvent).newState === 'open');
  }

  protected onKeydown(event: KeyboardEvent): void {
    const items = this.enabledItems();
    const current = items.indexOf(event.target as HTMLButtonElement);
    switch (event.key) {
      case 'ArrowDown':
        this.focusItem((current + 1) % items.length);
        break;
      case 'ArrowUp':
        this.focusItem(current <= 0 ? items.length - 1 : current - 1);
        break;
      case 'Home':
        this.focusItem(0);
        break;
      case 'End':
        this.focusItem(items.length - 1);
        break;
      case 'Escape':
        this.close();
        break;
      case 'Tab':
        this.hide();
        return;
      default: {
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
        const key = event.key.toLocaleLowerCase();
        const ordered = [...items.slice(current + 1), ...items.slice(0, current + 1)];
        const match = ordered.find((item) => item.textContent.trim().toLocaleLowerCase().startsWith(key));
        if (match) match.focus();
      }
    }
    event.preventDefault();
  }

  private hide(): void {
    if (this.isOpen()) this.element.hidePopover();
    this.isOpen.set(false);
  }

  private enabledItems(): HTMLButtonElement[] {
    return this.items()
      .map((item) => item.element)
      .filter((element) => !element.disabled);
  }

  private focusItem(index: number): void {
    this.enabledItems()[index]?.focus();
  }
}

/** Turns a button into the trigger of an `lg-menu`. */
@Directive({
  selector: 'button[lgMenuTrigger]',
  host: {
    'aria-haspopup': 'menu',
    '[id]': 'id',
    '[attr.aria-expanded]': 'lgMenuTrigger().isOpen()',
    '[attr.aria-controls]': 'lgMenuTrigger().id',
    '[style.anchor-name]': 'anchorName',
    '(click)': 'toggle()',
    '(keydown.arrowdown)': 'open($event, "first")',
    '(keydown.arrowup)': 'open($event, "last")',
  },
})
export class LgMenuTrigger {
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  /** The menu to open. */
  readonly lgMenuTrigger = input.required<LgMenu>();

  readonly id = this.element.id || lgUniqueId('lg-menu-trigger');
  protected readonly anchorName = `--${this.id}`;

  protected toggle(): void {
    const menu = this.lgMenuTrigger();
    if (menu.isOpen()) menu.close();
    else menu.openFrom(this.element, this.anchorName);
  }

  protected open(event: Event, focus: 'first' | 'last'): void {
    event.preventDefault();
    this.lgMenuTrigger().openFrom(this.element, this.anchorName, focus);
  }
}
