import type { NgDocPage } from '@ng-doc/core';
import { OutputDemo } from './demos/output';
import Category from '../ng-doc.category';

const OutputPage: NgDocPage = {
  title: 'Output',
  mdFile: './index.md',
  category: Category,
  demos: { OutputDemo },
};

export default OutputPage;
