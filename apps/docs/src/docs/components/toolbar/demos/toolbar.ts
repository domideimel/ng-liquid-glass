import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgToggle } from '@domideimel/ng-liquid-glass/segmented';
import { LgSeparator } from '@domideimel/ng-liquid-glass/separator';
import { LgToolbar } from '@domideimel/ng-liquid-glass/toolbar';

@Component({
  selector: 'docs-toolbar-demo',
  imports: [LgButton, LgSeparator, LgToggle, LgToolbar],
  template: `
    <div lgToolbar aria-label="Text formatting">
      <button lgToggle type="button" [(pressed)]="bold"><strong>Bold</strong></button>
      <button lgToggle type="button" [(pressed)]="italic"><em>Italic</em></button>
      <hr lgSeparator orientation="vertical" />
      <button lgButton variant="ghost" type="button">Link</button>
      <button lgButton variant="ghost" type="button" disabled>Undo</button>
    </div>
  `,
})
export class ToolbarDemo {
  protected readonly bold = signal(false);
  protected readonly italic = signal(false);
}
