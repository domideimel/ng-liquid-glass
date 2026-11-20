import { Directive, model } from '@angular/core';

/**
 * A segmented control built from native radio buttons: put `label[lgSegment]` elements, each wrapping an
 * `<input type="radio">`, in a `fieldset[lgSegmented]` with a `<legend>`. Arrow keys, form submission and
 * `[formField]` work natively.
 *
 * @example
 * <fieldset lgSegmented>
 *   <legend class="sr-only">View</legend>
 *   <label lgSegment><input type="radio" name="view" value="list" [formField]="form.view" /> List</label>
 *   <label lgSegment><input type="radio" name="view" value="grid" [formField]="form.view" /> Grid</label>
 * </fieldset>
 */
@Directive({
  selector: 'fieldset[lgSegmented]',
  host: {
    class:
      'm-0 inline-flex min-w-0 flex-wrap gap-1 rounded-lg-surface border-0 bg-lg-surface-muted p-1 [&>legend]:sr-only forced-colors:border forced-colors:border-[CanvasText]',
  },
})
export class LgSegmented {}

/** One option of `fieldset[lgSegmented]`: a `<label>` wrapping a radio input. */
@Directive({
  selector: 'label[lgSegment]',
  host: {
    class:
      'relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg-control border border-transparent px-4 font-medium text-lg-fg-muted hover:text-lg-fg has-checked:bg-lg-surface has-checked:text-lg-fg has-checked:shadow-sm has-checked:lg-forced-selected has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-lg-focus has-disabled:cursor-not-allowed has-disabled:opacity-60 [&>input]:sr-only',
  },
})
export class LgSegment {}

/**
 * A button that stays on or off (`aria-pressed`), e.g. "Bold" in an editor toolbar. For a choice between
 * options, use a segmented control instead.
 *
 * @example
 * <button lgToggle [(pressed)]="bold" aria-label="Bold">B</button>
 */
@Directive({
  selector: 'button[lgToggle]',
  host: {
    type: 'button',
    class:
      'lg-focus-ring inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg-control border border-lg-control-border bg-lg-surface px-3 font-[inherit] text-base font-medium text-lg-fg hover:bg-lg-surface-muted aria-pressed:border-lg-primary aria-pressed:bg-lg-primary aria-pressed:text-lg-on-primary aria-pressed:lg-forced-selected disabled:cursor-not-allowed disabled:opacity-60',
    '[attr.aria-pressed]': 'pressed()',
    '(click)': 'pressed.set(!pressed())',
  },
})
export class LgToggle {
  readonly pressed = model(false);
}
