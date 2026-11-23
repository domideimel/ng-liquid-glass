import { Component, signal } from '@angular/core';
import { LgButton } from '@domideimel/ng-liquid-glass/button';
import { LgDialog, LgDialogClose, LgDialogTitle } from '@domideimel/ng-liquid-glass/dialog';

@Component({
  selector: 'docs-sheet-demo',
  imports: [LgButton, LgDialog, LgDialogClose, LgDialogTitle],
  template: `
    <button lgButton type="button" (click)="shown.set(true)">Open setlists</button>
    <p class="mt-3 mb-0">Closed {{ closings() }} times.</p>
    @if (shown()) {
      <lg-dialog placement="sheet" dismissible [open]="true" (closed)="onClosed()">
        <div class="mb-4 flex items-center gap-2">
          <h2 lgDialogTitle class="!mb-0 me-auto">Setlists</h2>
          <button lgButton variant="ghost" type="button">New</button>
          <button lgButton variant="ghost" type="button" lgDialogClose aria-label="Close" class="!rounded-full !px-0">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul class="m-0 flex list-none flex-col gap-2 p-0">
          @for (setlist of setlists; track setlist) {
            <li class="rounded-lg-control bg-lg-surface-muted px-4 py-3">{{ setlist }}</li>
          }
        </ul>
      </lg-dialog>
    }
  `,
})
export class SheetDemo {
  protected readonly shown = signal(false);
  protected readonly closings = signal(0);
  protected readonly setlists = ['Sunday rehearsal', 'Gig at the Blue Note', 'Warm-up', 'Scales'];

  protected onClosed(): void {
    this.shown.set(false);
    this.closings.update((count) => count + 1);
  }
}
