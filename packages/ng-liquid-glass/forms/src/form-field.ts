import { Component, computed, DestroyRef, forwardRef, inject, InjectionToken, input, signal, type Signal } from '@angular/core';
import { lgUniqueId, LgStatusIcon } from '@domideimel/ng-liquid-glass';

/** What a control exposes to its surrounding `lg-form-field`. */
export interface LgFieldControl {
  readonly id: string;
  /** Whether the control should currently be announced and shown as invalid. */
  readonly showInvalid: Signal<boolean>;
  readonly isRequired: Signal<boolean>;
  readonly errorMessages: Signal<readonly string[]>;
}

export const LG_FORM_FIELD = new InjectionToken<LgFormField>('LG_FORM_FIELD');

/**
 * Lays out a label, an optional hint, a control and its errors, and wires them together with
 * `for`, `aria-describedby` and `aria-invalid`. Error messages from Signal Forms validators
 * (`required(path, { message })`) are rendered automatically; add `<lg-error>` for custom content.
 * For errors that don't come from validators (a parse error, a failed lookup), set `error`: the message
 * shows at once, in place of the validator messages, and the control is marked invalid.
 *
 * @example
 * <lg-form-field>
 *   <label lgLabel>Email</label>
 *   <lg-hint>We never share it.</lg-hint>
 *   <input lgInput type="email" [formField]="form.email" />
 * </lg-form-field>
 *
 * <lg-form-field [error]="parseError()">
 *   <label lgLabel>JSON</label>
 *   <textarea lgInput [formField]="form.json"></textarea>
 * </lg-form-field>
 */
@Component({
  selector: 'lg-form-field',
  imports: [LgStatusIcon],
  providers: [{ provide: LG_FORM_FIELD, useExisting: forwardRef(() => LgFormField) }],
  host: { class: 'flex flex-col gap-1.5' },
  template: `
    <ng-content select="[lgLabel]" />
    <ng-content select="lg-hint" />
    <ng-content />
    <div [id]="errorId" aria-live="polite" class="flex flex-col gap-1 text-sm font-medium text-lg-danger">
      @if (showErrors()) {
        @if (error()) {
          <p class="m-0 flex items-start gap-1.5"><lg-status-icon status="danger" />{{ error() }}</p>
        } @else {
          @for (message of control()?.errorMessages(); track message) {
            <p class="m-0 flex items-start gap-1.5"><lg-status-icon status="danger" />{{ message }}</p>
          }
        }
        <ng-content select="lg-error" />
      }
    </div>
  `,
})
export class LgFormField {
  readonly hintId = lgUniqueId('lg-hint');
  readonly errorId = lgUniqueId('lg-error');
  /** The registered control. Set by the control directive. */
  readonly control = signal<LgFieldControl | undefined>(undefined);
  /** Number of registered hints. Set by `lg-hint`. */
  readonly hints = signal(0);
  /**
   * An error that doesn't come from a validator, e.g. "Line 3, column 7: unexpected comma". While set,
   * it is shown at once in place of the validator messages, and the control gets `aria-invalid`.
   */
  readonly error = input<string | null | undefined>('');

  readonly showErrors = computed(() => !!this.error() || (this.control()?.showInvalid() ?? false));
  readonly describedBy = computed(() => {
    const ids = [this.hints() > 0 ? this.hintId : '', this.showErrors() ? this.errorId : ''].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : null;
  });
}

/** The label of a form field. Shows a visual `*` when the bound field is required. */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- enhances the native <label> element
  selector: 'label[lgLabel]',
  host: { class: 'font-medium text-lg-fg', '[attr.for]': 'field.control()?.id' },
  template: `<ng-content />
    @if (field.control()?.isRequired()) {
      <span aria-hidden="true" class="text-lg-danger"> *</span>
    }`,
})
export class LgLabel {
  protected readonly field = inject(LG_FORM_FIELD);
}

/** Help text for a form field, referenced by the control via `aria-describedby`. */
@Component({
  selector: 'lg-hint',
  host: { class: 'block text-sm text-lg-fg-muted', '[id]': 'field.hintId' },
  template: '<ng-content />',
})
export class LgHint {
  protected readonly field = inject(LG_FORM_FIELD);

  constructor() {
    this.field.hints.update((n) => n + 1);
    inject(DestroyRef).onDestroy(() => {
      this.field.hints.update((n) => n - 1);
    });
  }
}

/** Custom error content, shown while the field is invalid and touched. */
@Component({
  selector: 'lg-error',
  host: { class: 'flex items-start gap-1.5' },
  template: '<ng-content />',
})
export class LgError {}
