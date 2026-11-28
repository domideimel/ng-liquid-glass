import type { NgDocPage } from '@ng-doc/core';
import { FileDropDemo } from './demos/file-drop';
import { FileInputDemo } from './demos/file-input';
import Category from '../ng-doc.category';

const FileinputPage: NgDocPage = {
  title: 'File input',
  mdFile: './index.md',
  category: Category,
  demos: { FileDropDemo, FileInputDemo },
};

export default FileinputPage;
