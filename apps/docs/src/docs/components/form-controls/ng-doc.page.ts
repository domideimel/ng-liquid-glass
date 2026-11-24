import type { NgDocPage } from '@ng-doc/core';
import { TextFieldsDemo } from './demos/text-fields';
import { ChoicesDemo } from './demos/choices';
import { SliderLabelsDemo } from './demos/slider-labels';
import Category from '../ng-doc.category';

const FormControlsPage: NgDocPage = {
  title: 'Form controls',
  mdFile: './index.md',
  category: Category,
  demos: { TextFieldsDemo, ChoicesDemo, SliderLabelsDemo },
};

export default FormControlsPage;
