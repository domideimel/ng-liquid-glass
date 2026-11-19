import { Component } from '@angular/core';
import { LgCard } from '@domideimel/ng-liquid-glass/card';
import { LgCol, LgGrid } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-subgrid-demo',
  imports: [LgCard, LgCol, LgGrid],
  template: `
    <div lgGrid gap="lg">
      @for (plan of plans; track plan.name) {
        <article lgCard lgCol [span]="{ base: 12, md: 4 }" [rows]="3" class="gap-3">
          <h2 class="m-0 text-lg font-semibold">{{ plan.name }}</h2>
          <p class="m-0">{{ plan.text }}</p>
          <p class="m-0 self-end font-semibold">{{ plan.price }}</p>
        </article>
      }
    </div>
  `,
})
export class SubgridDemo {
  protected readonly plans = [
    { name: 'Free', text: 'For trying things out.', price: '€0' },
    { name: 'Pro', text: 'For professionals who need unlimited projects, priority support and advanced reports.', price: '€12 / month' },
    { name: 'Team', text: 'For teams.', price: '€30 / month' },
  ];
}
