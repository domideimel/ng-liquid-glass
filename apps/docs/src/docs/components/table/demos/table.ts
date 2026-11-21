import { Component, computed, signal } from '@angular/core';
import { LgBadge } from '@domideimel/ng-liquid-glass/badge';
import { lgSortRows, LgSortHeader, LgTable, LgTableScroll, type LgSort } from '@domideimel/ng-liquid-glass/table';

interface Invoice {
  number: string;
  customer: string;
  due: string;
  amount: number;
  paid: boolean;
}

@Component({
  selector: 'docs-table-demo',
  imports: [LgBadge, LgSortHeader, LgTable, LgTableScroll],
  template: `
    <div lgTableScroll aria-labelledby="docs-invoices">
      <table lgTable [(sort)]="sort">
        <caption id="docs-invoices">
          Invoices
        </caption>
        <thead>
          <tr>
            <th lgSortHeader="number">Number</th>
            <th lgSortHeader="customer">Customer</th>
            <th lgSortHeader="due">Due</th>
            <th lgSortHeader="amount">Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          @for (invoice of rows(); track invoice.number) {
            <tr>
              <td>{{ invoice.number }}</td>
              <td>{{ invoice.customer }}</td>
              <td>{{ invoice.due }}</td>
              <td>{{ invoice.amount }} €</td>
              <td>
                <span lgBadge [variant]="invoice.paid ? 'success' : 'warning'">{{ invoice.paid ? 'Paid' : 'Open' }}</span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TableDemo {
  protected readonly sort = signal<LgSort | null>({ active: 'due', direction: 'ascending' });
  private readonly invoices: Invoice[] = [
    { number: 'INV-1042', customer: 'Northwind', due: '2026-12-01', amount: 1250, paid: false },
    { number: 'INV-1039', customer: 'Contoso', due: '2026-11-15', amount: 480, paid: true },
    { number: 'INV-1045', customer: 'Fabrikam', due: '2026-12-20', amount: 3100, paid: false },
    { number: 'INV-1040', customer: 'Adventure Works', due: '2026-11-28', amount: 760, paid: true },
  ];
  protected readonly rows = computed(() => lgSortRows(this.invoices, this.sort()));
}
