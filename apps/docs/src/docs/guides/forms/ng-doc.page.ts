import type { NgDocPage } from '@ng-doc/core';
import { SignUpFormDemo } from './demos/sign-up-form';
import Category from '../ng-doc.category';

const FormsPage: NgDocPage = {
  title: 'Forms',
  mdFile: './index.md',
  category: Category,
  order: 4,
  demos: { SignUpFormDemo },
};

export default FormsPage;
