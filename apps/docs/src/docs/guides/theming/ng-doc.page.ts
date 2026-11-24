import type { NgDocPage } from '@ng-doc/core';
import Category from '../ng-doc.category';
import { CustomControlDemo } from './demos/custom-control';
import { DensityDemo } from './demos/density';

const ThemingPage: NgDocPage = {
  title: 'Theming',
  mdFile: './index.md',
  category: Category,
  order: 2,
  demos: { DensityDemo, CustomControlDemo },
};

export default ThemingPage;
