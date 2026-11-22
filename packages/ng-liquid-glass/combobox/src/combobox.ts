import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  type ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { LG_I18N, LgAnchoredPopup, lgUniqueId } from '@domideimel/ng-liquid-glass';
import { LgCustomControl } from '@domideimel/ng-liquid-glass/forms';

/** Default filter: case-insensitive "contains" on the displayed text. */
export function lgContains(text: string, query: string): boolean {
  return text.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}

/**
 * A typeahead (WAI-ARIA combobox with list autocomplete) for picking one option from a list.
 * Integrates with Signal Forms via `[formField]`; filters locally or, with `[filter]="null"`,
 * lets you load suggestions yourself from `(query)`.
 *
 * @example
 * <lg-combobox [options]="countries" [displayWith]="byName" [formField]="form.country" />
 */
@Component({
  selector: 'lg-combobox',
  imports: [LgAnchoredPopup],
  host: { class: 'relative block' },
  template: `
    <input
      #input
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      class="lg-focus-ring block min-h-11 w-full font-[inherit] rounded-lg-control border border-lg-control-border bg-lg-surface px-3 py-2 text-base text-lg-fg placeholder:text-lg-fg-muted disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-2 aria-invalid:border-lg-danger"
      [id]="id"
      [style.anchor-name]="anchorName"
      [value]="text()"
      [disabled]="disabled()"
      [attr.placeholder]="placeholder() || null"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="listboxId"
      [attr.aria-activedescendant]="activeId()"
      [attr.aria-describedby]="field?.describedBy()"
      [attr.aria-invalid]="showInvalid() || null"
      [attr.aria-required]="required() || null"
      [attr.aria-busy]="loading() || null"
      (input)="onInput($event)"
      (keydown)="onKeydown($event)"
      (click)="openList()"
      (blur)="onBlur($event)"
    />
    <div [lgAnchoredPopup]="popupVisible()" [anchor]="anchorName">
      <ul role="listbox" class="m-0 list-none p-0" [id]="listboxId" [hidden]="!expanded()" [attr.aria-label]="ariaLabel() || null">
        @for (option of results(); track $index; let i = $index) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -- keyboard is handled on the input via aria-activedescendant (ARIA combobox pattern) -->
          <li
            role="option"
            class="flex min-h-11 cursor-pointer items-center rounded-lg-control px-3 text-lg-fg"
            [class]="i === active() ? 'bg-lg-primary text-lg-on-primary lg-forced-selected' : 'hover:bg-lg-surface-muted'"
            [id]="optionId(i)"
            [attr.aria-selected]="i === active()"
            (pointerdown)="$event.preventDefault()"
            (click)="select(option)"
          >
            {{ display(option) }}
          </li>
        }
      </ul>
      @if (statusText()) {
        <p aria-hidden="true" class="m-0 px-3 py-2.5 text-lg-fg-muted">{{ statusText() }}</p>
      }
    </div>
    <span class="sr-only" aria-live="polite">{{ announcement() }}</span>
  `,
})
export class LgCombobox<T> extends LgCustomControl<T | null> {
  private readonly i18n = inject(LG_I18N);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly popup = viewChild.required(LgAnchoredPopup);

  /** The selected option. Bind with `[formField]` or `[(value)]`. */
  readonly value = model<T | null>(null);
  /** All options, or the current search results when filtering yourself. */
  readonly options = input<readonly T[]>([]);
  /** Text shown for an option. */
  readonly displayWith = input<(option: T) => string>(String);
  /** Local filter; `null` turns local filtering off (e.g. for server-side search). */
  readonly filter = input<((text: string, query: string) => boolean) | null>(lgContains);
  readonly placeholder = input('');
  /** Accessible name of the suggestion list. */
  readonly ariaLabel = input('');
  /** Shows a loading state while you fetch suggestions. */
  readonly loading = input(false, { transform: booleanAttribute });

  /** Emits the typed text, for loading suggestions. */
  readonly query = output<string>();

  readonly id = lgUniqueId('lg-combobox');
  protected readonly listboxId = `${this.id}-listbox`;
  protected readonly anchorName = `--${this.id}`;
  protected readonly text = linkedSignal(() => {
    const value = this.value();
    return value === null ? '' : this.displayWith()(value);
  });
  protected readonly open = signal(false);
  protected readonly active = signal(-1);

  protected readonly results = computed(() => {
    const filter = this.filter();
    const query = this.text();
    const options = this.options();
    return filter === null ? options : options.filter((option) => filter(this.display(option), query));
  });
  protected readonly expanded = computed(() => this.open() && this.results().length > 0);
  /** The popup shows the options, or a "Loading" / "No results" status. */
  protected readonly popupVisible = computed(() => this.expanded() || (this.open() && this.statusText() !== ''));
  protected readonly activeId = computed(() => (this.expanded() && this.active() >= 0 ? this.optionId(this.active()) : null));
  protected readonly statusText = computed(() => {
    if (this.loading()) return this.i18n.loading;
    return this.results().length === 0 && this.text().trim() !== '' ? this.i18n.noResults : '';
  });
  protected readonly announcement = computed(() => {
    if (!this.open()) return '';
    return this.statusText() || this.i18n.resultsCount(this.results().length);
  });

  constructor() {
    super();
    afterRenderEffect(() => {
      const id = this.activeId();
      if (id) this.input().nativeElement.ownerDocument.getElementById(id)?.scrollIntoView({ block: 'nearest' });
    });
  }

  /** Moves focus to the text input. */
  override focus(options?: FocusOptions): void {
    this.input().nativeElement.focus(options);
  }

  protected display(option: T): string {
    return this.displayWith()(option);
  }

  protected optionId(index: number): string {
    return `${this.id}-option-${index.toString()}`;
  }

  protected openList(): void {
    if (!this.disabled()) this.open.set(true);
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.text.set(text);
    this.active.set(-1);
    this.open.set(true);
    const value = this.value();
    if (value !== null && this.display(value) !== text) this.value.set(null);
    this.query.emit(text);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open()) {
          this.open.set(true);
          this.active.set(event.altKey ? -1 : 0);
        } else if (count > 0) {
          this.active.update((i) => (i + 1) % count);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.open()) {
          this.open.set(true);
          this.active.set(count - 1);
        } else if (count > 0) {
          this.active.update((i) => (i <= 0 ? count - 1 : i - 1));
        }
        break;
      case 'Enter': {
        const option = this.expanded() ? this.results()[this.active()] : undefined;
        if (option !== undefined) {
          event.preventDefault();
          this.select(option);
        }
        break;
      }
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.close();
        } else if (this.text() !== '') {
          event.preventDefault();
          this.text.set('');
          this.value.set(null);
        }
        break;
    }
  }

  protected onBlur(event: FocusEvent): void {
    // Focus moved into the list (e.g. an overlay scrollbar was dragged): keep it open and take focus back.
    if (this.popup().contains(event.relatedTarget)) {
      this.focus();
      return;
    }
    this.close();
    const value = this.value();
    this.text.set(value === null ? '' : this.display(value));
    this.touch.emit();
  }

  protected select(option: T): void {
    this.value.set(option);
    this.text.set(this.display(option));
    this.close();
  }

  private close(): void {
    this.open.set(false);
    this.active.set(-1);
  }
}
