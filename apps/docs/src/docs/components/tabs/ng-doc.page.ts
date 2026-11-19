import type { NgDocPage } from '@ng-doc/core';
import { TabsDemo } from './demos/tabs';
import Category from '../ng-doc.category';

const TabsPage: NgDocPage = {
  title: 'Tabs',
  mdFile: './index.md',
  category: Category,
  demos: { TabsDemo },
};

export default TabsPage;
