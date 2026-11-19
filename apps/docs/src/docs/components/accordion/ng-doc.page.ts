import type { NgDocPage } from '@ng-doc/core';
import { AccordionDemo } from './demos/accordion';
import Category from '../ng-doc.category';

const AccordionPage: NgDocPage = {
  title: 'Accordion',
  mdFile: './index.md',
  category: Category,
  demos: { AccordionDemo },
};

export default AccordionPage;
