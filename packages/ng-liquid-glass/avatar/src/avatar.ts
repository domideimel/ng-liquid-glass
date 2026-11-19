import { Component, computed, input, linkedSignal } from '@angular/core';

export type LgAvatarSize = 'sm' | 'md' | 'lg';

const SIZES: Record<LgAvatarSize, string> = { sm: 'size-8 text-xs', md: 'size-11 text-sm', lg: 'size-16 text-lg' };

/** A person's picture, falling back to their initials when there is no image or it fails to load. */
@Component({
  selector: 'lg-avatar',
  host: {
    class: 'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-lg-surface-muted font-semibold text-lg-fg',
    '[class]': 'sizeClass()',
  },
  template: `
    @if (src() && !failed()) {
      <img class="size-full object-cover" [src]="src()" [alt]="name()" (error)="failed.set(true)" />
    } @else {
      <span role="img" [attr.aria-label]="name()">{{ initials() }}</span>
    }
  `,
})
export class LgAvatar {
  /** The person's name, used as the accessible name. */
  readonly name = input.required<string>();
  readonly src = input<string | null>(null);
  readonly size = input<LgAvatarSize>('md');

  protected readonly failed = linkedSignal({ source: this.src, computation: () => false });
  protected readonly sizeClass = computed(() => SIZES[this.size()]);
  protected readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toLocaleUpperCase())
      .join(''),
  );
}
