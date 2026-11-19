import type { NgDocPage } from '@ng-doc/core';
import { BreadcrumbsDemo } from './demos/breadcrumbs';
import Category from '../ng-doc.category';

const BreadcrumbsPage: NgDocPage = {
  title: 'Breadcrumbs',
  mdFile: './index.md',
  category: Category,
  demos: { BreadcrumbsDemo },
};

export default BreadcrumbsPage;
