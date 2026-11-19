import { Component } from '@angular/core';
import { LgAccordionItem } from '@domideimel/ng-liquid-glass/accordion';

@Component({
  selector: 'docs-accordion-demo',
  imports: [LgAccordionItem],
  template: `
    <div class="max-w-xl">
      <details lgAccordionItem name="faq" open>
        <summary>How long does shipping take?</summary>
        <p>Orders ship within two working days.</p>
      </details>
      <details lgAccordionItem name="faq">
        <summary>Can I return an item?</summary>
        <p>Yes, within 30 days, free of charge.</p>
      </details>
      <details lgAccordionItem name="faq">
        <summary>Do you ship abroad?</summary>
        <p>We ship to all EU countries and Switzerland.</p>
      </details>
    </div>
  `,
})
export class AccordionDemo {}
