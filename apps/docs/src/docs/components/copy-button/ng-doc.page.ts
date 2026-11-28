import type { NgDocPage } from '@ng-doc/core';
import { CopyButtonDemo } from './demos/copy-button';
import Category from '../ng-doc.category';

const CopyButtonPage: NgDocPage = {
  title: 'Copy button',
  mdFile: './index.md',
  category: Category,
  demos: { CopyButtonDemo },
};

export default CopyButtonPage;
