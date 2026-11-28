import type { NgDocPage } from '@ng-doc/core';
import { ListDemo } from './demos/list';
import Category from '../ng-doc.category';

const ListPage: NgDocPage = {
  title: 'List',
  mdFile: './index.md',
  category: Category,
  demos: { ListDemo },
};

export default ListPage;
