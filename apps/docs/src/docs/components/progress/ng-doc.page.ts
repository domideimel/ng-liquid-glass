import type { NgDocPage } from '@ng-doc/core';
import { ProgressDemo } from './demos/progress';
import Category from '../ng-doc.category';

const ProgressPage: NgDocPage = {
  title: 'Progress',
  mdFile: './index.md',
  category: Category,
  demos: { ProgressDemo },
};

export default ProgressPage;
