import type { NgDocPage } from '@ng-doc/core';
import { ToastDemo } from './demos/toast';
import Category from '../ng-doc.category';

const ToastPage: NgDocPage = {
  title: 'Toast',
  mdFile: './index.md',
  category: Category,
  demos: { ToastDemo },
};

export default ToastPage;
