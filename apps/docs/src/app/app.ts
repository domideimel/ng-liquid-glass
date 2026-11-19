import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LgToasterRegion } from '@domideimel/ng-liquid-glass/toast';
import { NgDocNavbarComponent, NgDocRootComponent, NgDocSidebarComponent, NgDocThemeToggleComponent } from '@ng-doc/app';

@Component({
  selector: 'docs-root',
  imports: [
    RouterOutlet,
    RouterLink,
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
    NgDocThemeToggleComponent,
    LgToasterRegion,
  ],
  templateUrl: './app.html',
})
export class App {}
