import type { NgDocApi } from '@ng-doc/core';

const Api: NgDocApi = {
  title: 'API reference',
  scopes: [
    {
      name: '@domideimel/ng-liquid-glass',
      route: 'ng-liquid-glass',
      include: ['packages/ng-liquid-glass/src/index.ts', 'packages/ng-liquid-glass/*/src/index.ts'],
    },
  ],
};

export default Api;
