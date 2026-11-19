import type { NgDocPage } from '@ng-doc/core';
import { PaginationDemo } from './demos/pagination';
import Category from '../ng-doc.category';

const PaginationPage: NgDocPage = {
  title: 'Pagination',
  mdFile: './index.md',
  category: Category,
  demos: { PaginationDemo },
};

export default PaginationPage;
