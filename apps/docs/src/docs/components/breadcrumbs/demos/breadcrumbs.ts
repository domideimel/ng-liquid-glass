import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LgBreadcrumbs } from '@domideimel/ng-liquid-glass/breadcrumbs';

@Component({
  selector: 'docs-breadcrumbs-demo',
  imports: [LgBreadcrumbs, RouterLink],
  template: `
    <nav lgBreadcrumbs>
      <ol>
        <li><a routerLink="/">Home</a></li>
        <li><a routerLink="/components/button">Components</a></li>
        <li><a routerLink="/components/breadcrumbs" aria-current="page">Breadcrumbs</a></li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbsDemo {}
