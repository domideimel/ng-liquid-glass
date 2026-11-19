import type { NgDocPage } from '@ng-doc/core';
import { TooltipDemo } from './demos/tooltip';
import Category from '../ng-doc.category';

const TooltipPage: NgDocPage = {
  title: 'Tooltip',
  mdFile: './index.md',
  category: Category,
  demos: { TooltipDemo },
};

export default TooltipPage;
