import type { NgDocPage } from '@ng-doc/core';
import { StepperDemo } from './demos/stepper';
import Category from '../ng-doc.category';

const StepperPage: NgDocPage = {
  title: 'Stepper',
  mdFile: './index.md',
  category: Category,
  demos: { StepperDemo },
};

export default StepperPage;
