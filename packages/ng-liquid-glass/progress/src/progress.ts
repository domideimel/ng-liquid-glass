import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { LG_I18N } from '@domideimel/ng-liquid-glass';

/** Styles a native `<progress>`. Omit `value` for an indeterminate state; label it with `aria-label` or a `<label>`. */
@Directive({
  selector: 'progress[lgProgress]',
  host: {
    class:
      'block h-2 w-full appearance-none overflow-hidden rounded-full bg-lg-surface-muted text-lg-primary [&::-moz-progress-bar]:bg-lg-primary [&::-webkit-progress-bar]:bg-lg-surface-muted [&::-webkit-progress-value]:bg-lg-primary',
  },
})
export class LgProgress {}

/** Styles a native `<meter>` for a known range, e.g. storage used. */
@Directive({
  selector: 'meter[lgMeter]',
  host: {
    class:
      'block h-2 w-full appearance-none overflow-hidden rounded-full bg-lg-surface-muted [&::-moz-meter-bar]:bg-lg-primary [&::-webkit-meter-bar]:h-2 [&::-webkit-meter-bar]:rounded-full [&::-webkit-meter-bar]:border-0 [&::-webkit-meter-bar]:bg-lg-surface-muted [&::-webkit-meter-even-less-good-value]:bg-lg-danger [&::-webkit-meter-optimum-value]:bg-lg-primary [&::-webkit-meter-suboptimum-value]:bg-lg-warning',
  },
})
export class LgMeter {}

/** An indeterminate loading indicator announced as a status. Prefer `lgProgress` when progress is known. */
@Component({
  selector: 'lg-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', class: 'inline-flex items-center gap-2 text-lg-fg' },
  template: `
    <svg aria-hidden="true" class="size-6 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </svg>
    <span class="sr-only">{{ label() || i18n.loading }}</span>
  `,
})
export class LgSpinner {
  protected readonly i18n = inject(LG_I18N);
  /** Announced text; defaults to the translated "Loading". */
  readonly label = input('');
}
