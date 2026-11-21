import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';
import { lgUniqueId } from '@domideimel/ng-liquid-glass';
import { LG_FORM_FIELD, type LgFieldControl } from '@domideimel/ng-liquid-glass/forms';

/**
 * A select with rich options (WAI-ARIA select-only combobox): each option can have a second line of
 * description. Prefer `<select lgInput>` for plain text options; use this when options need more.
 * Keyboard: Enter, Space or the arrow keys open it, arrows and Home/End move, typing jumps to a match,
 * Enter or Space selects, Escape closes. Works with `[formField]` and `lg-form-field`.
 *
 * @example
 * <lg-select [options]="plans" [displayWith]="byName" [describeWith]="byPrice" [formField]="form.plan" />
 */
@Component({
  selector: 'lg-select',
  host: { class: 'relative block' },
  template: `
    <button
      #button
      type="button"
      role="combobox"
      class="lg-focus-ring flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg-control border border-lg-control-border bg-lg-surface px-3 py-2 text-start font-[inherit] text-base text-lg-fg disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-2 aria-invalid:border-lg-danger"
      [id]="id"
      [style.anchor-name]="anchorName"
      [disabled]="disabled()"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="listboxId"
      [attr.aria-activedescendant]="open() && active() >= 0 ? optionId(active()) : null"
      [attr.aria-describedby]="field?.describedBy()"
      [attr.aria-invalid]="showInvalid() || null"
      [attr.aria-required]="required() || null"
      (click)="toggle()"
      (keydown)="onKeydown($event)"
      (blur)="onBlur()"
    >
      <span class="truncate" [class.text-lg-fg-muted]="selectedIndex() < 0">{{ label() }}</span>
      <svg
        aria-hidden="true"
        class="shrink-0"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    <div
      #popup
      popover="manual"
      class="lg-glass m-0 max-h-72 w-[anchor-size(width)] overflow-auto rounded-lg-surface p-1 shadow-xl [inset:auto] [margin-block:0.25rem] [position-area:block-end_span-inline-end] [position-try-fallbacks:flip-block]"
      [style.position-anchor]="anchorName"
    >
      <ul role="listbox" class="m-0 list-none p-0" [id]="listboxId" [attr.aria-labelledby]="id">
        @for (option of options(); track $index; let i = $index) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -- keyboard is handled on the button via aria-activedescendant -->
          <li
            role="option"
            class="flex min-h-11 cursor-pointer flex-col justify-center rounded-lg-control px-3 py-1.5 text-lg-fg"
            [class]="i === active() ? 'bg-lg-primary text-lg-on-primary lg-forced-selected' : 'hover:bg-lg-surface-muted'"
            [id]="optionId(i)"
            [attr.aria-selected]="i === selectedIndex()"
            (pointerdown)="$event.preventDefault()"
            (click)="select(i)"
          >
            <span class="flex items-center gap-2 font-medium">
              {{ display(option) }}
              @if (i === selectedIndex()) {
                <svg
                  aria-hidden="true"
                  class="ms-auto"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m5 12 5 5 9-10" />
                </svg>
              }
            </span>
            @if (describe(option); as description) {
              <span class="text-sm" [class.text-lg-fg-muted]="i !== active()">{{ description }}</span>
            }
          </li>
        }
      </ul>
    </div>
  `,
})
export class LgSelect<T> implements FormValueControl<T | null>, LgFieldControl {
  protected readonly field = inject(LG_FORM_FIELD, { optional: true });
  private readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');
  private readonly popup = viewChild.required<ElementRef<HTMLElement>>('popup');

  /** The selected option. Bind with `[formField]` or `[(value)]`. */
  readonly value = model<T | null>(null);
  readonly options = input<readonly T[]>([]);
  /** Main text of an option, also shown when it is selected. */
  readonly displayWith = input<(option: T) => string>(String);
  /** Optional second line of an option. */
  readonly describeWith = input<((option: T) => string) | null>(null);
  /** Compares options with the value; defaults to identity. */
  readonly compareWith = input<(a: T, b: T) => boolean>(Object.is);
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  /** Signal Forms marks the field as touched on this event. */
  readonly touch = output();

  readonly id = lgUniqueId('lg-select');
  protected readonly listboxId = `${this.id}-listbox`;
  protected readonly anchorName = `--${this.id}`;
  protected readonly open = signal(false);
  protected readonly active = signal(-1);
  private typeahead = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly selectedIndex = computed(() => {
    const value = this.value();
    const compare = this.compareWith();
    return value === null ? -1 : this.options().findIndex((option) => compare(option, value));
  });
  protected readonly label = computed(() => {
    const option = this.options()[this.selectedIndex()];
    return option === undefined ? this.placeholder() : this.display(option);
  });
  readonly showInvalid = computed(() => this.invalid() && this.touched());
  readonly isRequired = this.required;
  readonly errorMessages = computed(() =>
    this.errors()
      .map((error) => error.message)
      .filter((message): message is string => !!message),
  );

  constructor() {
    const field = this.field;
    if (field) {
      field.control.set(this);
      inject(DestroyRef).onDestroy(() => {
        field.control.set(undefined);
      });
    }
    afterRenderEffect(() => {
      const popup = this.popup().nativeElement;
      const open = this.open() && this.options().length > 0;
      if (open !== popup.matches(':popover-open')) popup.togglePopover(open);
    });
    afterRenderEffect(() => {
      if (this.open() && this.active() >= 0) {
        this.button().nativeElement.ownerDocument.getElementById(this.optionId(this.active()))?.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /** Moves focus to the select. */
  focus(options?: FocusOptions): void {
    this.button().nativeElement.focus(options);
  }

  protected display(option: T): string {
    return this.displayWith()(option);
  }

  protected describe(option: T): string {
    return this.describeWith()?.(option) ?? '';
  }

  protected optionId(index: number): string {
    return `${this.id}-option-${index.toString()}`;
  }

  protected toggle(): void {
    if (this.open()) this.close();
    else this.show(Math.max(this.selectedIndex(), 0));
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.options().length;
    if (count === 0) return;
    const open = this.open();
    const key = event.key;
    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        this.show(key === 'ArrowUp' && this.selectedIndex() < 0 ? count - 1 : Math.max(this.selectedIndex(), 0));
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault();
        this.show(key === 'Home' ? 0 : count - 1);
      } else {
        this.search(event);
      }
      return;
    }
    switch (key) {
      case 'ArrowDown':
        this.active.update((i) => Math.min(i + 1, count - 1));
        break;
      case 'ArrowUp':
        this.active.update((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        this.active.set(0);
        break;
      case 'End':
        this.active.set(count - 1);
        break;
      case 'Enter':
      case ' ':
        if (this.typeahead !== '' && key === ' ') {
          this.search(event);
          return;
        }
        this.select(this.active());
        break;
      case 'Escape':
        this.close();
        break;
      case 'Tab':
        this.close();
        return;
      default:
        this.search(event);
        return;
    }
    event.preventDefault();
  }

  protected onBlur(): void {
    this.close();
    this.touch.emit();
  }

  protected select(index: number): void {
    const option = this.options()[index];
    if (option === undefined) return;
    this.value.set(option);
    this.close();
    this.focus();
  }

  private show(active: number): void {
    if (this.disabled()) return;
    this.active.set(active);
    this.open.set(true);
  }

  private close(): void {
    this.open.set(false);
    this.active.set(-1);
    this.typeahead = '';
  }

  /** Type-ahead: jumps to the next option starting with the typed characters; opens the list if needed. */
  private search(event: KeyboardEvent): void {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    clearTimeout(this.typeaheadTimer);
    this.typeaheadTimer = setTimeout(() => {
      this.typeahead = '';
    }, 500);
    this.typeahead += event.key.toLocaleLowerCase();
    const options = this.options();
    const start = this.open() ? this.active() : this.selectedIndex();
    // The same character typed repeatedly cycles through options starting with it.
    const repeated = /^(.)\1+$/u.test(this.typeahead);
    const query = repeated ? this.typeahead.charAt(0) : this.typeahead;
    const order = [...options.keys()].map(
      (offset) => (start + (repeated || this.typeahead.length === 1 ? 1 : 0) + offset) % options.length,
    );
    const match = order.find((i) => {
      const option = options[i];
      return option !== undefined && this.display(option).toLocaleLowerCase().startsWith(query);
    });
    if (match !== undefined) this.show(match);
  }
}
