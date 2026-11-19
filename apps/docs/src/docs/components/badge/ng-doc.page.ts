import type { NgDocPage } from '@ng-doc/core';
import { BadgeDemo } from './demos/badge';
import Category from '../ng-doc.category';

const BadgePage: NgDocPage = {
  title: 'Badge',
  mdFile: './index.md',
  category: Category,
  demos: { BadgeDemo },
};

export default BadgePage;
