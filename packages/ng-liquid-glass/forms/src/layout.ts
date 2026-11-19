import { Directive } from '@angular/core';

/** A label wrapping a checkbox, radio or switch with its text; the whole row is a ≥ 44 px target. */
@Directive({
  selector: 'label[lgChoice]',
  host: {
    class: 'inline-flex min-h-11 cursor-pointer items-center gap-3 text-lg-fg has-disabled:cursor-not-allowed has-disabled:opacity-60',
  },
})
export class LgChoice {}

/** Groups related controls; style its first-child `<legend>` as the group label. */
@Directive({
  selector: 'fieldset[lgFieldset]',
  host: {
    class: 'm-0 flex min-w-0 flex-col gap-1 border-0 p-0 [&>legend]:mb-2 [&>legend]:p-0 [&>legend]:font-medium [&>legend]:text-lg-fg',
  },
})
export class LgFieldset {}
