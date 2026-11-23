import type { NgDocPage } from '@ng-doc/core';
import { DialogDemo } from './demos/dialog';
import { AlertDialogDemo } from './demos/alert-dialog';
import { DrawerDemo } from './demos/drawer';
import { SheetDemo } from './demos/sheet';
import Category from '../ng-doc.category';

const DialogPage: NgDocPage = {
  title: 'Dialog',
  mdFile: './index.md',
  category: Category,
  demos: { DialogDemo, AlertDialogDemo, DrawerDemo, SheetDemo },
};

export default DialogPage;
