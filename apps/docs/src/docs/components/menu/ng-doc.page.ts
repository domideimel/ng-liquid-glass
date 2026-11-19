import type { NgDocPage } from '@ng-doc/core';
import { MenuDemo } from './demos/menu';
import Category from '../ng-doc.category';

const MenuPage: NgDocPage = {
  title: 'Menu',
  mdFile: './index.md',
  category: Category,
  demos: { MenuDemo },
};

export default MenuPage;
