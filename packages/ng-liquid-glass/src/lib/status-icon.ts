import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LgStatus = 'info' | 'success' | 'warning' | 'danger';

/** Decorative status icon. Status is always conveyed in text too (WCAG 1.4.1 Use of Color). */
@Component({
  selector: 'lg-status-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (status()) {
        @case ('success') {
          <circle cx="12" cy="12" r="10" />
          <path d="m8 12 3 3 5-6" />
        }
        @case ('warning') {
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        }
        @case ('danger') {
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6M9 9l6 6" />
        }
        @default {
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        }
      }
    </svg>
  `,
})
export class LgStatusIcon {
  readonly status = input<LgStatus>('info');
}
