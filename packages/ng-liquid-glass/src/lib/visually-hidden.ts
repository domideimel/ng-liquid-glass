import { Directive } from '@angular/core';

/** Hides content visually while keeping it available to assistive technology. */
@Directive({
  selector: '[lgVisuallyHidden]',
  host: { class: 'sr-only' },
})
export class LgVisuallyHidden {}
