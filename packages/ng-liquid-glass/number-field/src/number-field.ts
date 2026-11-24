import {
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { LG_I18N } from '@domideimel/ng-liquid-glass';
import { LgCustomControl } from '@domideimel/ng-liquid-glass/forms';

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 75;

/**
 * A number with − and + buttons (WAI-ARIA spinbutton pattern), e.g. a tempo or a count. Keyboard: arrows step,
 * Page Up/Down step by `largeStep`, Home/End jump to `min`/`max`; typed values apply on Enter or blur and are
 * clamped. The buttons repeat while held and stay out of the tab order (keyboard users use the arrows). Works
 * with `[formField]` and `lg-form-field`; then the range comes from the schema's `min()` / `max()`.
 *
 * @example
 * <lg-form-field>
 *   <label lgLabel>Tempo</label>
 *   <lg-number-field [valueText]="bpm" [formField]="form.tempo" />
 * </lg-form-field>
 */
@Component({
  selector: 'lg-number-field',
  host: { class: 'inline-flex' },
  template: `
    <div
      class="flex items-stretch rounded-lg-control border border-lg-control-border bg-lg-surface has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-lg-focus has-[input:disabled]:opacity-60"
      [class.border-2]="showInvalid()"
      [class.border-lg-danger]="showInvalid()"
    >
      <button
        type="button"
        tabindex="-1"
        data-lg-part="decrease"
        class="inline-flex min-h-lg-control min-w-lg-control cursor-pointer items-center justify-center rounded-s-lg-control border-0 bg-transparent text-lg-fg hover:bg-lg-surface-muted disabled:cursor-not-allowed"
        [attr.aria-label]="i18n.decrease"
        [disabled]="disabled() || atMin()"
        (pointerdown)="startRepeat($event, -1)"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
      <input
        #input
        type="text"
        role="spinbutton"
        inputmode="decimal"
        autocomplete="off"
        class="w-[calc(var(--lg-digits,4)*1ch+1.5rem)] min-w-0 border-0 bg-transparent text-center font-[inherit] text-base text-lg-fg tabular-nums outline-none"
        [id]="id"
        [value]="text()"
        [disabled]="disabled()"
        [attr.aria-valuenow]="value()"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuetext]="ariaValueText()"
        [attr.aria-describedby]="field?.describedBy()"
        [attr.aria-invalid]="showInvalid() || null"
        [attr.aria-required]="required() || null"
        (input)="text.set(input.value)"
        (keydown)="onKeydown($event)"
        (blur)="commit(); touch.emit()"
      />
      <button
        type="button"
        tabindex="-1"
        data-lg-part="increase"
        class="inline-flex min-h-lg-control min-w-lg-control cursor-pointer items-center justify-center rounded-e-lg-control border-0 bg-transparent text-lg-fg hover:bg-lg-surface-muted disabled:cursor-not-allowed"
        [attr.aria-label]="i18n.increase"
        [disabled]="disabled() || atMax()"
        (pointerdown)="startRepeat($event, 1)"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M5 12h14M12 5v14" />
        </svg>
      </button>
    </div>
  `,
})
export class LgNumberField extends LgCustomControl<number | null> {
  protected readonly i18n = inject(LG_I18N);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  /** The number. Bind with `[formField]` or `[(value)]`. */
  readonly value = model<number | null>(null);
  /** With `[formField]`, Signal Forms sets these from the schema's `min()` / `max()` validators. */
  readonly min = input(-Infinity, { transform: (value: unknown) => numberAttribute(value, -Infinity) });
  readonly max = input(Infinity, { transform: (value: unknown) => numberAttribute(value, Infinity) });
  /** Arrow keys and buttons. */
  readonly step = input(1, { transform: numberAttribute });
  /** Page Up / Page Down. */
  readonly largeStep = input(10, { transform: numberAttribute });
  /** What screen readers announce for a value, e.g. `(n) => \`${n} BPM\``. */
  readonly valueText = input<((value: number) => string) | null>(null);

  readonly id = this.controlId('lg-number-field');
  /** The input's text; follows the value and holds what the user types until it is applied. */
  protected readonly text = linkedSignal(() => {
    const value = this.value();
    return value === null ? '' : String(value);
  });
  protected readonly atMin = computed(() => (this.value() ?? -Infinity) <= this.min());
  protected readonly atMax = computed(() => (this.value() ?? Infinity) >= this.max());
  protected readonly ariaValueText = computed(() => {
    const value = this.value();
    const format = this.valueText();
    return value === null || !format ? null : format(value);
  });

  private repeatTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => {
      this.stopRepeat();
    });
  }

  /** Moves focus to the input. */
  override focus(options?: FocusOptions): void {
    this.input().nativeElement.focus(options);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const actions: Record<string, (() => void) | undefined> = {
      ArrowUp: () => {
        this.stepBy(1);
      },
      ArrowDown: () => {
        this.stepBy(-1);
      },
      PageUp: () => {
        this.set((this.value() ?? 0) + this.largeStep());
      },
      PageDown: () => {
        this.set((this.value() ?? 0) - this.largeStep());
      },
      Home: Number.isFinite(this.min())
        ? () => {
            this.set(this.min());
          }
        : undefined,
      End: Number.isFinite(this.max())
        ? () => {
            this.set(this.max());
          }
        : undefined,
      Enter: () => {
        this.commit();
      },
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  /** Applies the typed text: a number is clamped, anything else restores the current value. */
  protected commit(): void {
    const text = this.text().trim().replace(',', '.');
    if (text === '') {
      this.value.set(null);
      return;
    }
    const parsed = Number(text);
    if (Number.isFinite(parsed)) this.set(parsed);
    else this.text.set(this.value() === null ? '' : String(this.value()));
  }

  /** Steps once on press, then repeats while the button is held. */
  protected startRepeat(event: PointerEvent, direction: 1 | -1): void {
    if (event.button !== 0 || this.disabled()) return;
    // Keep focus in the input, so the value stays announced and the arrows keep working.
    event.preventDefault();
    this.focus();
    this.stepBy(direction);
    const button = event.currentTarget as HTMLElement;
    const stop = (): void => {
      this.stopRepeat();
    };
    for (const type of ['pointerup', 'pointerleave', 'pointercancel']) button.addEventListener(type, stop, { once: true });
    const repeat = (delay: number): void => {
      this.repeatTimer = setTimeout(() => {
        this.stepBy(direction);
        repeat(REPEAT_INTERVAL_MS);
      }, delay);
    };
    repeat(REPEAT_DELAY_MS);
  }

  private stopRepeat(): void {
    clearTimeout(this.repeatTimer);
    this.repeatTimer = undefined;
  }

  private stepBy(direction: 1 | -1): void {
    const current = this.value() ?? (Number.isFinite(this.min()) ? this.min() : 0);
    this.set(this.value() === null ? current : current + direction * this.step());
  }

  private set(value: number): void {
    if (this.disabled()) return;
    // Rounded to the step's precision, so 0.1 steps don't drift into 0.30000000000000004.
    const decimals = (String(this.step()).split('.')[1] ?? '').length;
    const clamped = Math.min(this.max(), Math.max(this.min(), Number(value.toFixed(decimals))));
    this.value.set(clamped);
    this.text.set(String(clamped));
    if (clamped === this.min() || clamped === this.max()) this.stopRepeat();
  }
}
