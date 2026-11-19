import { booleanAttribute, Directive, input } from '@angular/core';

/** A surface for grouping content. Use it on `<article>` or `<section>` with a heading. */
@Directive({
  selector: '[lgCard]',
  host: {
    class: 'block rounded-lg-surface p-6 text-lg-fg',
    '[class.lg-glass]': 'glass()',
    '[class.shadow-lg]': 'glass()',
    '[class.border]': '!glass()',
    '[class.border-lg-border]': '!glass()',
    '[class.bg-lg-surface]': '!glass()',
  },
})
export class LgCard {
  /** Uses the frosted glass material, for cards floating over imagery. */
  readonly glass = input(false, { transform: booleanAttribute });
}
