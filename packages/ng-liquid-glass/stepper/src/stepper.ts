import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { LG_I18N } from '@domideimel/ng-liquid-glass';

/**
 * Shows progress through a multi-step process. Steps before `current` are complete (announced as
 * "completed"), the current one has `aria-current="step"`. Name it with `label`.
 *
 * @example
 * <lg-stepper label="Checkout" [steps]="['Cart', 'Address', 'Payment', 'Review']" current="2" />
 */
@Component({
  selector: 'lg-stepper',
  host: { class: 'block' },
  template: `
    <nav [attr.aria-label]="label()">
      <ol class="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
        @for (step of steps(); track $index; let i = $index) {
          <li
            class="flex items-center gap-2 text-lg-fg-muted"
            [attr.aria-current]="i === index() ? 'step' : null"
            [class.text-lg-fg]="i <= index()"
          >
            <span
              aria-hidden="true"
              class="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold"
              [class]="
                i < index()
                  ? 'border-lg-primary bg-lg-primary text-lg-on-primary lg-forced-selected'
                  : i === index()
                    ? 'border-lg-primary text-lg-fg'
                    : 'border-lg-control-border'
              "
            >
              @if (i < index()) {
                <svg
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
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span [class.font-semibold]="i === index()">
              {{ step }}
              @if (i < index()) {
                <span class="sr-only">({{ i18n.completed }})</span>
              }
            </span>
          </li>
        }
      </ol>
    </nav>
  `,
})
export class LgStepper {
  protected readonly i18n = inject(LG_I18N);
  /** Step labels, in order. */
  readonly steps = input.required<readonly string[]>();
  /** The current step, starting at 1. */
  readonly current = input(1, { transform: numberAttribute });
  /** Accessible name of the step list. */
  readonly label = input.required<string>();
  protected readonly index = computed(() => this.current() - 1);
}
