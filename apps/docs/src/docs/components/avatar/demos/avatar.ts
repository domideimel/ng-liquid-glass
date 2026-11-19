import { Component } from '@angular/core';
import { LgAvatar } from '@domideimel/ng-liquid-glass/avatar';
import { LgCluster } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-avatar-demo',
  imports: [LgAvatar, LgCluster],
  template: `
    <div lgCluster gap="md">
      <lg-avatar name="Ada Lovelace" size="sm" />
      <lg-avatar name="Grace Hopper" />
      <lg-avatar name="Alan Turing" size="lg" />
      <lg-avatar name="Broken Image" src="/does-not-exist.png" size="lg" />
    </div>
  `,
})
export class AvatarDemo {}
