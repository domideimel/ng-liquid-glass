import type { Page } from '@playwright/test';

/** Pointer targets in the demos that are smaller than `min` px in either direction. */
export function smallTargets(page: Page, min: number): Promise<{ name: string; width: number; height: number }[]> {
  return page.locator('.ng-doc-demo-frame').evaluateAll((demos, minimum) => {
    const selector = 'button, a[href], input:not([type=hidden]), select, textarea, summary, [role=option], [role=tab], [role=menuitem]';
    return (
      demos
        .flatMap((demo) => [...demo.querySelectorAll<HTMLElement>(selector)])
        .filter((el) => el.checkVisibility())
        // 2.5.5 / 2.5.8 exception: links inside a sentence are inline targets.
        .filter((el) => !el.matches('p a[href]'))
        .map((el) => {
          // Checkboxes, radios and visually hidden file inputs are activated through their wrapping label.
          const target = el.matches('input[type=checkbox], input[type=radio], input[type=file]') ? (el.closest('label') ?? el) : el;
          const box = target.getBoundingClientRect();
          // lg-hit-area extends the pointer target with an invisible, absolutely positioned ::before.
          const hit = getComputedStyle(target, '::before');
          const extended = hit.content !== 'none' && hit.position === 'absolute';
          const width = Math.max(box.width, extended ? parseFloat(hit.width) : 0);
          const height = Math.max(box.height, extended ? parseFloat(hit.height) : 0);
          return { name: el.outerHTML.slice(0, 80), width: Math.round(width), height: Math.round(height) };
        })
        .filter(({ width, height }) => width < minimum || height < minimum)
    );
  }, min);
}
