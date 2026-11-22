import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { lgPageWindow, LgPagination } from './pagination';

describe('lgPageWindow', () => {
  it('keeps first, last and neighbours, collapsing gaps', () => {
    expect(lgPageWindow(1, 1)).toEqual([1]);
    expect(lgPageWindow(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
    // A single hidden page is shown instead of an ellipsis.
    expect(lgPageWindow(4, 10)).toEqual([1, 2, 3, 4, 5, null, 10]);
    expect(lgPageWindow(7, 10)).toEqual([1, null, 6, 7, 8, 9, 10]);
    expect(lgPageWindow(2, 4)).toEqual([1, 2, 3, 4]);
    expect(lgPageWindow(1, 10, 2)).toEqual([1, 2, 3, null, 10]);
  });
});

describe('LgPagination', () => {
  it('marks the current page and moves between pages', async () => {
    const page = signal(1);
    await render(`<lg-pagination [(page)]="page" pageCount="5" />`, { imports: [LgPagination], componentProperties: { page } });
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveAttribute('aria-disabled', 'true');
    await expectNoA11yViolations();

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(page()).toBe(2);
    await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));
    expect(page()).toBe(5);
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(page()).toBe(4);
  });

  it('keeps focus on next and previous at the ends', async () => {
    const page = signal(2);
    await render(`<lg-pagination [(page)]="page" pageCount="3" />`, { imports: [LgPagination], componentProperties: { page } });
    const next = screen.getByRole('button', { name: 'Next page' });
    next.focus();
    await userEvent.keyboard('{Enter}');
    expect(page()).toBe(3);
    expect(next).toHaveFocus();
    expect(next).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Enter}');
    expect(page()).toBe(3);
    expect(next).toHaveFocus();
  });
});
