import type { NgDocPage } from '@ng-doc/core';
import { TextFieldsDemo } from './demos/text-fields';
import { ChoicesDemo } from './demos/choices';
import Category from '../ng-doc.category';

const FormControlsPage: NgDocPage = {
  title: 'Form controls',
  mdFile: './index.md',
  category: Category,
  demos: { TextFieldsDemo, ChoicesDemo },
};

export default FormControlsPage;
