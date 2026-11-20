import { computed, DestroyRef, Directive, HostAttributeToken, inject } from '@angular/core';
import { FORM_FIELD } from '@angular/forms/signals';
import { lgUniqueId } from '@domideimel/ng-liquid-glass';
import { LG_FORM_FIELD, type LgFieldControl } from './form-field';

/**
 * Shared behaviour of the native form controls: reads the Signal Forms state of a `[formField]`
 * on the same element and connects the control to its `lg-form-field`.
 */
@Directive({
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'field?.describedBy()',
    '[attr.aria-invalid]': 'showInvalid() || null',
  },
})
export abstract class LgNativeControl implements LgFieldControl {
  private readonly formField = inject(FORM_FIELD, { optional: true, self: true });
  protected readonly field = inject(LG_FORM_FIELD, { optional: true });

  readonly id = inject(new HostAttributeToken('id'), { optional: true }) ?? lgUniqueId('lg-control');

  readonly showInvalid = computed(() => {
    const state = this.formField?.state();
    return state !== undefined && state.invalid() && state.touched();
  });
  readonly isRequired = computed(() => this.formField?.state().required() ?? false);
  readonly errorMessages = computed(() =>
    (this.formField?.errors() ?? []).map((error) => error.message).filter((message): message is string => !!message),
  );

  constructor() {
    const field = this.field;
    if (field) {
      field.control.set(this);
      inject(DestroyRef).onDestroy(() => {
        field.control.set(undefined);
      });
    }
  }
}

/** A text input, textarea or native select. */
@Directive({
  selector: 'input[lgInput], textarea[lgInput], select[lgInput]',
  host: {
    class:
      'lg-focus-ring block min-h-11 w-full font-[inherit] rounded-lg-control border border-lg-control-border bg-lg-surface px-3 py-2 text-base text-lg-fg placeholder:text-lg-fg-muted disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-2 aria-invalid:border-lg-danger',
  },
})
export class LgInput extends LgNativeControl {}

/** A native checkbox. Wrap it with its text in `<label lgChoice>` for a 44 px target. */
@Directive({
  selector: 'input[type=checkbox][lgCheckbox]',
  host: { class: 'lg-focus-ring size-6 shrink-0 cursor-pointer accent-lg-primary disabled:cursor-not-allowed' },
})
export class LgCheckbox extends LgNativeControl {}

/** A native radio button. Group radios in `<fieldset lgFieldset>` with a `<legend>`. */
@Directive({
  selector: 'input[type=radio][lgRadio]',
  host: { class: 'lg-focus-ring size-6 shrink-0 cursor-pointer accent-lg-primary disabled:cursor-not-allowed' },
})
export class LgRadio extends LgNativeControl {}

/** A native checkbox presented and announced as an on/off switch. */
@Directive({
  selector: 'input[type=checkbox][lgSwitch]',
  host: {
    role: 'switch',
    class:
      "lg-focus-ring relative h-7 w-12 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-lg-control-border bg-lg-surface-muted transition-colors before:absolute before:top-0.5 before:start-0.5 before:size-5 before:rounded-full before:bg-lg-fg before:transition-transform before:content-[''] checked:border-lg-primary checked:bg-lg-primary checked:before:translate-x-5 rtl:checked:before:-translate-x-5 checked:before:bg-lg-on-primary disabled:cursor-not-allowed disabled:opacity-60 forced-colors:appearance-auto forced-colors:before:hidden",
  },
})
export class LgSwitch extends LgNativeControl {}

/** A native range slider with a 44 px tall hit area. */
@Directive({
  selector: 'input[type=range][lgSlider]',
  host: { class: 'lg-focus-ring block h-11 w-full cursor-pointer accent-lg-primary disabled:cursor-not-allowed' },
})
export class LgSlider extends LgNativeControl {}
