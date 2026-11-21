import type { NgDocPage } from '@ng-doc/core';
import { KbdDemo } from './demos/kbd';
import Category from '../ng-doc.category';

const KeyboardkeyPage: NgDocPage = {
  title: 'Keyboard key',
  mdFile: './index.md',
  category: Category,
  demos: { KbdDemo },
};

export default KeyboardkeyPage;
