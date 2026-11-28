import type { NgDocPage } from '@ng-doc/core';
import { CardDemo } from './demos/card';
import { CardHeaderDemo } from './demos/card-header';
import Category from '../ng-doc.category';

const CardPage: NgDocPage = {
  title: 'Card',
  mdFile: './index.md',
  category: Category,
  demos: { CardDemo, CardHeaderDemo },
};

export default CardPage;
