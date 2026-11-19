import type { NgDocPage } from '@ng-doc/core';
import { SkeletonDemo } from './demos/skeleton';
import Category from '../ng-doc.category';

const SkeletonPage: NgDocPage = {
  title: 'Skeleton',
  mdFile: './index.md',
  category: Category,
  demos: { SkeletonDemo },
};

export default SkeletonPage;
