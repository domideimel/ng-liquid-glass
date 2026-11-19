import type { NgDocPage } from '@ng-doc/core';
import { GridDemo } from './demos/grid';
import { AutoGridDemo } from './demos/auto-grid';
import { SubgridDemo } from './demos/subgrid';
import Category from '../ng-doc.category';

const LayoutPage: NgDocPage = {
  title: 'Layout & grid',
  mdFile: './index.md',
  category: Category,
  demos: { GridDemo, AutoGridDemo, SubgridDemo },
};

export default LayoutPage;
