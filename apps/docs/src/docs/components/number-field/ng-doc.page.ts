import type { NgDocPage } from '@ng-doc/core';
import { NumberFieldDemo } from './demos/number-field';
import Category from '../ng-doc.category';

const NumberFieldPage: NgDocPage = {
  title: 'Number field',
  mdFile: './index.md',
  category: Category,
  demos: { NumberFieldDemo },
};

export default NumberFieldPage;
