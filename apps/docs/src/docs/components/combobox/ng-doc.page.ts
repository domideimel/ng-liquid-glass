import type { NgDocPage } from '@ng-doc/core';
import { ComboboxDemo } from './demos/combobox';
import { ComboboxSearchDemo } from './demos/combobox-search';
import Category from '../ng-doc.category';

const ComboboxPage: NgDocPage = {
  title: 'Combobox (typeahead)',
  mdFile: './index.md',
  category: Category,
  demos: { ComboboxDemo, ComboboxSearchDemo },
};

export default ComboboxPage;
