import { Component, computed, contentChildren, Directive, ElementRef, forwardRef, inject, input, model } from '@angular/core';
import { lgUniqueId } from '@domideimel/ng-liquid-glass';

/** A tab button. Its `value` links it to the `lgTabPanel` with the same value. */
@Directive({
  selector: 'button[lgTab]',
  host: {
    type: 'button',
    role: 'tab',
    class:
      'lg-focus-ring min-h-11 cursor-pointer rounded-lg-control border border-transparent bg-transparent font-[inherit] text-base px-4 font-medium text-lg-fg-muted hover:text-lg-fg aria-selected:bg-lg-surface aria-selected:text-lg-fg aria-selected:shadow-sm aria-selected:lg-forced-selected',
    '[id]': 'tabs.tabId(value())',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-controls]': 'tabs.panelId(value())',
    '[attr.tabindex]': 'selected() ? 0 : -1',
    '(click)': 'tabs.value.set(value())',
  },
})
export class LgTab {
  protected readonly tabs = inject<LgTabs>(forwardRef(() => LgTabs));
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  readonly value = input.required<string>();
  protected readonly selected = computed(() => this.tabs.selectedValue() === this.value());
}

/** The content shown while the tab with the same `value` is selected. */
@Directive({
  selector: '[lgTabPanel]',
  host: {
    role: 'tabpanel',
    tabindex: '0',
    class: 'lg-focus-ring block rounded-lg-control pt-4',
    '[id]': 'tabs.panelId(value())',
    '[attr.aria-labelledby]': 'tabs.tabId(value())',
    '[hidden]': 'tabs.selectedValue() !== value()',
  },
})
export class LgTabPanel {
  protected readonly tabs = inject<LgTabs>(forwardRef(() => LgTabs));
  readonly value = input.required<string>();
}

/**
 * Tabs (WAI-ARIA tabs pattern with automatic activation): Arrow keys, Home and End move between
 * tabs, Tab moves into the panel. Arrow keys follow the reading direction (`dir="rtl"`).
 *
 * @example
 * <lg-tabs [(value)]="tab" label="Settings">
 *   <button lgTab value="profile">Profile</button>
 *   <div lgTabPanel value="profile">…</div>
 * </lg-tabs>
 */
@Component({
  selector: 'lg-tabs',
  host: { class: 'block' },
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/interactive-supports-focus -- roving tabindex: the tabs inside are focusable, the tablist is not -->
    <div
      role="tablist"
      class="inline-flex flex-wrap gap-1 rounded-lg-surface bg-lg-surface-muted p-1"
      [attr.aria-label]="label()"
      (keydown)="onKeydown($event)"
    >
      <ng-content select="[lgTab]" />
    </div>
    <ng-content />
  `,
})
export class LgTabs {
  private readonly tabs = contentChildren(LgTab);
  private readonly id = lgUniqueId('lg-tabs');

  /** The value of the selected tab; defaults to the first tab. */
  readonly value = model<string>('');
  /** Accessible name of the tab list. */
  readonly label = input.required<string>();

  readonly selectedValue = computed(() => this.value() || (this.tabs()[0]?.value() ?? ''));

  tabId(value: string): string {
    return `${this.id}-tab-${value}`;
  }

  panelId(value: string): string {
    return `${this.id}-panel-${value}`;
  }

  protected onKeydown(event: KeyboardEvent): void {
    const tabs = this.tabs().filter((tab) => !tab.element.disabled);
    const current = tabs.findIndex((tab) => tab.value() === this.selectedValue());
    const following = (current + 1) % tabs.length;
    const preceding = current <= 0 ? tabs.length - 1 : current - 1;
    // In a right-to-left layout the following tab sits to the left.
    const rtl = getComputedStyle(event.currentTarget as Element).direction === 'rtl';
    const next = {
      ArrowRight: rtl ? preceding : following,
      ArrowLeft: rtl ? following : preceding,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    const tab = next === undefined ? undefined : tabs[next];
    if (!tab) return;
    event.preventDefault();
    this.value.set(tab.value());
    tab.element.focus();
  }
}
