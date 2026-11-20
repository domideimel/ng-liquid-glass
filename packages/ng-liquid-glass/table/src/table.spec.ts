import { Component, computed, signal } from '@angular/core';
import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { lgSortRows, LgSortHeader, LgTable, LgTableScroll, type LgSort } from './table';

interface Invoice {
  number: string;
  customer: string;
  amount: number;
}
const INVOICES: Invoice[] = [
  { number: 'INV-10', customer: 'Bravo', amount: 120 },
  { number: 'INV-9', customer: 'alpha', amount: 80 },
  { number: 'INV-11', customer: 'Charlie', amount: 300 },
];

@Component({
  imports: [LgTable, LgSortHeader, LgTableScroll],
  template: `
    <div lgTableScroll aria-labelledby="caption">
      <table lgTable [(sort)]="sort">
        <caption id="caption">
          Invoices
        </caption>
        <thead>
          <tr>
            <th lgSortHeader="number">Number</th>
            <th lgSortHeader="customer">Customer</th>
            <th lgSortHeader="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.number) {
            <tr>
              <td>{{ row.number }}</td>
              <td>{{ row.customer }}</td>
              <td>{{ row.amount }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
class InvoiceTable {
  readonly sort = signal<LgSort | null>(null);
  readonly rows = computed(() => lgSortRows(INVOICES, this.sort()));
}

const firstColumn = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0]?.textContent);

describe('LgTable', () => {
  it('sorts with header buttons and exposes aria-sort on the sorted column only', async () => {
    const { fixture } = await render(InvoiceTable);
    expect(screen.getByRole('table', { name: 'Invoices' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Invoices' })).toHaveAttribute('tabindex', '0');
    const number = screen.getByRole('columnheader', { name: 'Number' });
    expect(number).not.toHaveAttribute('aria-sort');

    await userEvent.click(within(number).getByRole('button'));
    expect(number).toHaveAttribute('aria-sort', 'ascending');
    expect(firstColumn()).toEqual(['INV-9', 'INV-10', 'INV-11']);

    await userEvent.click(within(number).getByRole('button'));
    expect(number).toHaveAttribute('aria-sort', 'descending');
    expect(firstColumn()).toEqual(['INV-11', 'INV-10', 'INV-9']);

    await userEvent.click(within(screen.getByRole('columnheader', { name: 'Amount' })).getByRole('button'));
    expect(number).not.toHaveAttribute('aria-sort');
    expect(fixture.componentInstance.sort()).toEqual({ active: 'amount', direction: 'ascending' });
    expect(firstColumn()).toEqual(['INV-9', 'INV-10', 'INV-11']);
    await expectNoA11yViolations();
  });

  it('sorts strings case-insensitively and keeps the input unchanged', () => {
    const sorted = lgSortRows(INVOICES, { active: 'customer', direction: 'ascending' });
    expect(sorted.map((row) => row.customer)).toEqual(['alpha', 'Bravo', 'Charlie']);
    expect(INVOICES[0]?.customer).toBe('Bravo');
    expect(lgSortRows(INVOICES, null)).toEqual(INVOICES);
    expect(
      lgSortRows(INVOICES, { active: 'amount', direction: 'descending' }, (row, column) => row[column as keyof Invoice])[0]?.amount,
    ).toBe(300);
    expect(lgSortRows([{ v: null }, { v: 'a' }], { active: 'v', direction: 'ascending' })[0]?.v).toBeNull();
  });
});
