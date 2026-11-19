import { render, screen } from '@testing-library/angular';
import { LgCluster, LgCol, LgContainer, LgGrid, LgStack } from './grid';

describe('layout', () => {
  it('renders a 12-column container-query grid with responsive spans', async () => {
    await render(
      `<div lgGrid gap="lg" data-testid="grid">
         <div lgCol data-testid="full"></div>
         <div lgCol [span]="{ base: 12, md: 6, xl: 4 }" [start]="{ md: 2 }" data-testid="responsive"></div>
         <div lgCol [span]="3" start="auto" [rows]="3" subgrid data-testid="sub"></div>
       </div>`,
      { imports: [LgGrid, LgCol] },
    );
    expect(screen.getByTestId('grid')).toHaveClass('grid', '@container', 'grid-cols-12', 'gap-6');
    expect(screen.getByTestId('full')).toHaveClass('col-span-full');
    expect(screen.getByTestId('responsive')).toHaveClass('col-span-12', '@lg-md:col-span-6', '@lg-xl:col-span-4', '@lg-md:col-start-2');
    expect(screen.getByTestId('sub')).toHaveClass('col-span-3', 'col-start-auto', 'grid-rows-subgrid', 'row-span-3', 'grid-cols-subgrid');
  });

  it('switches to an intrinsic auto-fill grid', async () => {
    await render(`<ul lgGrid minItemWidth="16rem" gap="none"><li>a</li></ul>`, { imports: [LgGrid] });
    const grid = screen.getByRole('list');
    expect(grid).toHaveClass('gap-0');
    expect(grid).not.toHaveClass('grid-cols-12');
    expect(grid.style.getPropertyValue('--lg-grid-min')).toBe('16rem');
  });

  it('provides container, stack and cluster helpers', async () => {
    await render(
      `<main lgContainer size="sm"><div lgStack gap="xl" data-testid="stack"><div lgCluster data-testid="cluster"></div></div></main>`,
      { imports: [LgContainer, LgStack, LgCluster] },
    );
    expect(screen.getByRole('main')).toHaveClass('mx-auto', 'max-w-3xl');
    expect(screen.getByTestId('stack')).toHaveClass('flex-col', 'gap-10');
    expect(screen.getByTestId('cluster')).toHaveClass('flex-wrap', 'gap-2');
  });
});
