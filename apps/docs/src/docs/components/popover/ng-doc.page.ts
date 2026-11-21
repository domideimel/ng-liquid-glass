import type { NgDocPage } from '@ng-doc/core';
import { PopoverDemo } from './demos/popover';
import Category from '../ng-doc.category';

const PopoverPage: NgDocPage = {
  title: 'Popover',
  mdFile: './index.md',
  category: Category,
  demos: { PopoverDemo },
};

export default PopoverPage;
