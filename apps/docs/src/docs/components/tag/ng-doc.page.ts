import type { NgDocPage } from '@ng-doc/core';
import { TagDemo } from './demos/tag';
import { TagInputDemo } from './demos/tag-input';
import Category from '../ng-doc.category';

const TagPage: NgDocPage = {
  title: 'Tag',
  mdFile: './index.md',
  category: Category,
  demos: { TagDemo, TagInputDemo },
};

export default TagPage;
