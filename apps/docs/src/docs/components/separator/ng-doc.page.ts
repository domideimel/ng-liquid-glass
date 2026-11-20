import type { NgDocPage } from '@ng-doc/core';
import { SeparatorDemo } from './demos/separator';
import Category from '../ng-doc.category';

const SeparatorPage: NgDocPage = {
  title: 'Separator',
  mdFile: './index.md',
  category: Category,
  demos: { SeparatorDemo },
};

export default SeparatorPage;
