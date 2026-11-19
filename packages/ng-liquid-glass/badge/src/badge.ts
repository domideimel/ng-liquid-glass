import { computed, Directive, input } from '@angular/core';
import type { LgStatus } from '@domideimel/ng-liquid-glass';

export type LgBadgeVariant = 'neutral' | LgStatus;

const VARIANTS: Record<LgBadgeVariant, string> = {
  neutral: 'bg-lg-surface-muted text-lg-fg',
  info: 'bg-lg-info-surface text-lg-info',
  success: 'bg-lg-success-surface text-lg-success',
  warning: 'bg-lg-warning-surface text-lg-warning',
  danger: 'bg-lg-danger-surface text-lg-danger',
};

/** A short status label. The text carries the meaning; colour only reinforces it. */
@Directive({
  selector: '[lgBadge]',
  host: { class: 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium', '[class]': 'variantClass()' },
})
export class LgBadge {
  readonly variant = input<LgBadgeVariant>('neutral');
  protected readonly variantClass = computed(() => VARIANTS[this.variant()]);
}
