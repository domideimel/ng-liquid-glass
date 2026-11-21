import type { NgDocPage } from '@ng-doc/core';
import { NavigationDemo } from './demos/navigation';
import Category from '../ng-doc.category';

const NavigationPage: NgDocPage = {
  title: 'Navigation',
  mdFile: './index.md',
  category: Category,
  demos: { NavigationDemo },
};

export default NavigationPage;
