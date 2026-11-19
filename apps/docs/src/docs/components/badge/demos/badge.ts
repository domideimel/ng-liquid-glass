import { Component } from '@angular/core';
import { LgBadge } from '@domideimel/ng-liquid-glass/badge';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-badge-demo',
  imports: [LgBadge, LgCluster],
  template: `
    <div lgCluster>
      <span lgBadge>Draft</span>
      <span lgBadge variant="info">In review</span>
      <span lgBadge variant="success">Paid</span>
      <span lgBadge variant="warning">Due soon</span>
      <span lgBadge variant="danger">Overdue</span>
    </div>
  `,
})
export class BadgeDemo {}
