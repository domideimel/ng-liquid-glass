import { Component } from '@angular/core';
import { LgAlert } from '@domideimel/ng-liquid-glass/alert';
import { LgStack } from '@domideimel/ng-liquid-glass/layout';

@Component({
  selector: 'docs-alert-demo',
  imports: [LgAlert, LgStack],
  template: `
    <div lgStack>
      <lg-alert heading="Scheduled maintenance">The service is unavailable on Sunday from 2:00 to 4:00 CET.</lg-alert>
      <lg-alert status="success" heading="Payment received">Invoice 2026-114 is paid.</lg-alert>
      <lg-alert status="warning" heading="Card expires soon">Update your payment method before 30 November.</lg-alert>
      <lg-alert status="danger" heading="Sync failed">3 files could not be uploaded. Check your connection and try again.</lg-alert>
    </div>
  `,
})
export class AlertDemo {}
