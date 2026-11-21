import type { NgDocPage } from '@ng-doc/core';
import { LinkDemo } from './demos/link';
import Category from '../ng-doc.category';

const LinkPage: NgDocPage = {
  title: 'Link',
  mdFile: './index.md',
  category: Category,
  demos: { LinkDemo },
};

export default LinkPage;
