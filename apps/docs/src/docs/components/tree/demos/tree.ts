import { Component, signal } from '@angular/core';
import { LgTree, type LgTreeNode } from '@domideimel/ng-liquid-glass/tree';

@Component({
  selector: 'docs-tree-demo',
  imports: [LgTree],
  template: `
    <lg-tree label="Project files" class="max-w-xs" [nodes]="files" [(value)]="selected" [(expanded)]="expanded" />
    <p class="mt-3 mb-0">Selected: {{ selected() ?? 'nothing' }}</p>
  `,
})
export class TreeDemo {
  protected readonly files: LgTreeNode[] = [
    {
      label: 'src',
      value: 'src',
      children: [
        {
          label: 'app',
          value: 'src/app',
          children: [
            { label: 'app.ts', value: 'src/app/app.ts' },
            { label: 'app.config.ts', value: 'src/app/app.config.ts' },
          ],
        },
        { label: 'main.ts', value: 'src/main.ts' },
        { label: 'styles.css', value: 'src/styles.css' },
      ],
    },
    { label: 'angular.json', value: 'angular.json' },
    { label: 'package.json', value: 'package.json' },
  ];
  protected readonly selected = signal<string | null>('src/main.ts');
  protected readonly expanded = signal<readonly string[]>(['src']);
}
