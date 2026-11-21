import type { NgDocPage } from '@ng-doc/core';
import { ToolbarDemo } from './demos/toolbar';
import Category from '../ng-doc.category';

const ToolbarPage: NgDocPage = {
  title: 'Toolbar',
  mdFile: './index.md',
  category: Category,
  demos: { ToolbarDemo },
};

export default ToolbarPage;
