import { booleanAttribute, computed, DestroyRef, Directive, inject, input, output, type ModelSignal } from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';
import { LG_FORM_FIELD, type LgFieldControl } from './form-field';

/**
 * Base class of the library's custom form controls (combobox, select, tag input, file input). It provides
 * what Signal Forms binds through `[formField]` (`disabled`, `required`, `invalid`, `touched`, `errors`,
 * `touch`) and registers the control with its `lg-form-field`, which then wires the label, hint and errors.
 * Subclasses declare `value` (a model) and `id`, and emit `touch` when the user leaves the control.
 */
@Directive()
export abstract class LgCustomControl<T> implements FormValueControl<T>, LgFieldControl {
  protected readonly field = inject(LG_FORM_FIELD, { optional: true });

  abstract readonly value: ModelSignal<T>;
  abstract readonly id: string;

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  /** Signal Forms marks the field as touched on this event. */
  readonly touch = output();

  /** Errors are shown once the user has left the control. */
  readonly showInvalid = computed(() => this.invalid() && this.touched());
  readonly isRequired = computed(() => this.required());
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
  }

  /** Moves focus to the control. */
  abstract focus(options?: FocusOptions): void;
}
