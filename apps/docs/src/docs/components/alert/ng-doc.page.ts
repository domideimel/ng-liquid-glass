import type { NgDocPage } from '@ng-doc/core';
import { AlertDemo } from './demos/alert';
import Category from '../ng-doc.category';

const AlertPage: NgDocPage = {
  title: 'Alert',
  mdFile: './index.md',
  category: Category,
  demos: { AlertDemo },
};

export default AlertPage;
