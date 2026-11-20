import type { NgDocPage } from '@ng-doc/core';
import { SegmentedDemo } from './demos/segmented';
import { ToggleDemo } from './demos/toggle';
import Category from '../ng-doc.category';

const SegmentedcontrolPage: NgDocPage = {
  title: 'Segmented control',
  mdFile: './index.md',
  category: Category,
  demos: { SegmentedDemo, ToggleDemo },
};

export default SegmentedcontrolPage;
