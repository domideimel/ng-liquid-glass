import type { NgDocPage } from '@ng-doc/core';
import { ButtonDemo } from './demos/button';
import Category from '../ng-doc.category';

const ButtonPage: NgDocPage = {
  title: 'Button',
  mdFile: './index.md',
  category: Category,
  demos: { ButtonDemo },
};

export default ButtonPage;
