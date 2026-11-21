import type { NgDocPage } from '@ng-doc/core';
import { DialogDemo } from './demos/dialog';
import { DrawerDemo } from './demos/drawer';
import Category from '../ng-doc.category';

const DialogPage: NgDocPage = {
  title: 'Dialog',
  mdFile: './index.md',
  category: Category,
  demos: { DialogDemo, DrawerDemo },
};

export default DialogPage;
