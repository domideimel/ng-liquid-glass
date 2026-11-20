import { Component } from '@angular/core';
import { LgThemeSwitcher } from '@domideimel/ng-liquid-glass/theme';

@Component({
  selector: 'docs-theme-demo',
  imports: [LgThemeSwitcher],
  template: `<lg-theme-switcher />`,
})
export class ThemeDemo {}
