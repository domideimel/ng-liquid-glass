import { Component } from '@angular/core';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';
import { LgSeparator } from '@domideimel/ng-liquid-glass/separator';

@Component({
  selector: 'docs-separator-demo',
  imports: [LgCluster, LgSeparator],
  template: `
    <p class="m-0">Account settings</p>
    <hr lgSeparator />
    <p class="m-0">Notification settings</p>
    <div lgCluster class="mt-6">
      <span>Edited today</span>
      <hr lgSeparator orientation="vertical" />
      <span>3 comments</span>
      <hr lgSeparator orientation="vertical" />
      <span>Public</span>
    </div>
  `,
})
export class SeparatorDemo {}
