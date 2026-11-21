import { computed, Directive, input } from '@angular/core';

export type LgSeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Styles a native `<hr>` as a separator between groups of content. Vertical separators sit between
 * inline items, e.g. in a toolbar or cluster.
 *
 * @example
 * <hr lgSeparator />
 * <hr lgSeparator orientation="vertical" />
 */
@Directive({
  selector: 'hr[lgSeparator]',
  host: {
    class: 'shrink-0 border-0 border-lg-border',
    '[class]': 'orientationClass()',
    '[attr.aria-orientation]': "orientation() === 'vertical' ? 'vertical' : null",
  },
})
export class LgSeparator {
  readonly orientation = input<LgSeparatorOrientation>('horizontal');
  protected readonly orientationClass = computed(() =>
    this.orientation() === 'vertical' ? 'mx-1 h-auto w-px self-stretch border-s' : 'my-4 h-px w-full border-t',
  );
}
