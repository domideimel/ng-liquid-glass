import { Component, inject } from '@angular/core';
import { LgCopyButton } from '@domideimel/ng-liquid-glass/copy-button';
import { LgOutput } from '@domideimel/ng-liquid-glass/output';
import { LgToaster } from '@domideimel/ng-liquid-glass/toast';

@Component({
  selector: 'docs-copy-button-demo',
  imports: [LgCopyButton, LgOutput],
  template: `
    <div class="flex max-w-xl flex-col gap-4">
      <div class="flex items-start gap-2">
        <output lgOutput mono class="min-w-0 flex-1" aria-label="UUID">{{ uuid }}</output>
        <lg-copy-button label="Copy UUID" [value]="uuid" />
      </div>
      <div>
        <lg-copy-button showLabel variant="secondary" label="Copy CSS" [value]="css" (copied)="toast()" />
      </div>
    </div>
  `,
})
export class CopyButtonDemo {
  private readonly toaster = inject(LgToaster);
  protected readonly uuid = '3f2b8c1e-9d4a-4e7b-a6f0-12c5d8e9b047';
  protected readonly css = '.glass { backdrop-filter: blur(12px); }';

  protected toast(): void {
    this.toaster.show({ message: 'CSS copied to the clipboard', status: 'success', duration: 5000 });
  }
}
