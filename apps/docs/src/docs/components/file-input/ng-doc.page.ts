import type { NgDocPage } from '@ng-doc/core';
import { FileInputDemo } from './demos/file-input';
import Category from '../ng-doc.category';

const FileinputPage: NgDocPage = {
  title: 'File input',
  mdFile: './index.md',
  category: Category,
  demos: { FileInputDemo },
};

export default FileinputPage;
