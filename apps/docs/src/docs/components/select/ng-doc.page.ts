import type { NgDocPage } from '@ng-doc/core';
import { SelectDemo } from './demos/select';
import Category from '../ng-doc.category';

const SelectPage: NgDocPage = {
  title: 'Select',
  mdFile: './index.md',
  category: Category,
  demos: { SelectDemo },
};

export default SelectPage;
