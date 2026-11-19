import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LgStack } from '@domideimel/ng-liquid-glass/layout';
import { LgMeter, LgProgress, LgSpinner } from '@domideimel/ng-liquid-glass/progress';

@Component({
  selector: 'docs-progress-demo',
  imports: [LgMeter, LgProgress, LgSpinner, LgStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div lgStack gap="lg" class="max-w-md">
      <label class="flex flex-col gap-2">Uploading report.pdf (60 %) <progress lgProgress max="100" value="60">60 %</progress></label>
      <label class="flex flex-col gap-2">Preparing export <progress lgProgress></progress></label>
      <label class="flex flex-col gap-2"
        >Storage used (95 of 100 GB) <meter lgMeter min="0" max="100" low="70" high="90" optimum="20" value="95"></meter
      ></label>
      <lg-spinner label="Loading invoices" />
    </div>
  `,
})
export class ProgressDemo {}
