import type { NgDocPage } from '@ng-doc/core';
import { AvatarDemo } from './demos/avatar';
import Category from '../ng-doc.category';

const AvatarPage: NgDocPage = {
  title: 'Avatar',
  mdFile: './index.md',
  category: Category,
  demos: { AvatarDemo },
};

export default AvatarPage;
