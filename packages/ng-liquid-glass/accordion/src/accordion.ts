import { Directive } from '@angular/core';

/**
 * A disclosure built on native `<details>`/`<summary>`. Give several items the same `name`
 * to let only one be open at a time.
 *
 * @example
 * <details lgAccordionItem name="faq"><summary>Question</summary><p>Answer</p></details>
 */
@Directive({
  selector: 'details[lgAccordionItem]',
  host: {
    class:
      "group border-b border-lg-border text-lg-fg [&>summary]:flex [&>summary]:min-h-lg-control [&>summary]:cursor-pointer [&>summary]:list-none [&>summary]:items-center [&>summary]:justify-between [&>summary]:gap-4 [&>summary]:rounded-lg-control [&>summary]:py-3 [&>summary]:font-medium [&>summary::-webkit-details-marker]:hidden [&>summary]:after:size-2 [&>summary]:after:shrink-0 [&>summary]:after:rotate-45 [&>summary]:after:border-r-2 [&>summary]:after:border-b-2 [&>summary]:after:border-current [&>summary]:after:transition-transform [&>summary]:after:content-[''] open:[&>summary]:after:-rotate-135 [&>summary:focus-visible]:outline-3 [&>summary:focus-visible]:outline-offset-2 [&>summary:focus-visible]:outline-lg-focus [&>:not(summary)]:pb-4",
  },
})
export class LgAccordionItem {}
