import { Component, computed, input } from '@angular/core';
import { LgStatusIcon, type LgStatus } from '@domideimel/ng-liquid-glass';

const STATUS_CLASSES: Record<LgStatus, string> = {
  info: 'border-lg-info bg-lg-info-surface [&>lg-status-icon]:text-lg-info',
  success: 'border-lg-success bg-lg-success-surface [&>lg-status-icon]:text-lg-success',
  warning: 'border-lg-warning bg-lg-warning-surface [&>lg-status-icon]:text-lg-warning',
  danger: 'border-lg-danger bg-lg-danger-surface [&>lg-status-icon]:text-lg-danger',
};

/**
 * An inline message. Static content needs no role; set `role="alert"` (urgent) or
 * `role="status"` only when the alert appears dynamically and must be announced.
 *
 * @example
 * <lg-alert status="success" heading="Saved">Your changes are live.</lg-alert>
 */
@Component({
  selector: 'lg-alert',
  imports: [LgStatusIcon],
  host: { class: 'flex gap-3 rounded-lg-surface border-s-4 p-4 text-lg-fg', '[class]': 'statusClass()' },
  template: `
    <lg-status-icon [status]="status()" class="mt-0.5" />
    <div class="flex flex-col gap-1">
      @if (heading()) {
        <p class="m-0 font-semibold">{{ heading() }}</p>
      }
      <div><ng-content /></div>
    </div>
  `,
})
export class LgAlert {
  readonly status = input<LgStatus>('info');
  /** Bold first line. */
  readonly heading = input('');
  protected readonly statusClass = computed(() => STATUS_CLASSES[this.status()]);
}
