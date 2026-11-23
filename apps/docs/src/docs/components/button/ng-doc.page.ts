import type { NgDocPage } from '@ng-doc/core';
import { ButtonDemo } from './demos/button';
import { ButtonBadgeDemo } from './demos/button-badge';
import { ButtonSizesDemo } from './demos/button-sizes';
import Category from '../ng-doc.category';

const ButtonPage: NgDocPage = {
  title: 'Button',
  mdFile: './index.md',
  category: Category,
  demos: { ButtonDemo, ButtonSizesDemo, ButtonBadgeDemo },
};

export default ButtonPage;
