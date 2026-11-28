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

/**
 * The top row of a card: its heading on the start side and a few actions (`[lgCardActions]`) on the
 * end side, centred on the buttons. Wraps onto two rows when there is no room.
 *
 * @example
 * <section lgCard aria-labelledby="result-title">
 *   <header lgCardHeader>
 *     <h2 id="result-title">Result</h2>
 *     <div lgCardActions>
 *       <button lgButton variant="ghost" shape="circle" aria-label="Copy">…</button>
 *       <button lgButton variant="ghost" shape="circle" aria-label="Download">…</button>
 *     </div>
 *   </header>
 *   …
 * </section>
 */
@Directive({
  selector: '[lgCardHeader]',
  host: {
    class:
      'mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 [&>:is(h1,h2,h3,h4,h5,h6)]:m-0 [&>:is(h1,h2,h3,h4,h5,h6)]:min-w-0 [&>:is(h1,h2,h3,h4,h5,h6)]:text-lg [&>:is(h1,h2,h3,h4,h5,h6)]:font-semibold',
  },
})
export class LgCardHeader {}

/** A row of actions in `[lgCardHeader]`, kept together on the end side. */
@Directive({
  selector: '[lgCardActions]',
  host: { class: 'ms-auto flex shrink-0 flex-wrap items-center gap-1' },
})
export class LgCardActions {}
