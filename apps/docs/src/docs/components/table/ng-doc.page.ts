import type { NgDocPage } from '@ng-doc/core';
import { TableDemo } from './demos/table';
import Category from '../ng-doc.category';

const TablePage: NgDocPage = {
  title: 'Table',
  mdFile: './index.md',
  category: Category,
  demos: { TableDemo },
};

export default TablePage;
