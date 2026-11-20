import type { NgDocPage } from '@ng-doc/core';
import { ThemeDemo } from './demos/theme';
import Category from '../ng-doc.category';

const ThemeswitcherPage: NgDocPage = {
  title: 'Theme switcher',
  mdFile: './index.md',
  category: Category,
  demos: { ThemeDemo },
};

export default ThemeswitcherPage;
