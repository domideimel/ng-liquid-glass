import type { NgDocPage } from '@ng-doc/core';
import { TreeDemo } from './demos/tree';
import Category from '../ng-doc.category';

const TreePage: NgDocPage = {
  title: 'Tree',
  mdFile: './index.md',
  category: Category,
  demos: { TreeDemo },
};

export default TreePage;
