import { booleanAttribute, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { LG_I18N, lgAnnouncement } from '@domideimel/ng-liquid-glass';
import { LgButton, type LgButtonVariant } from '@domideimel/ng-liquid-glass/button';

/** How long the check mark stays after copying. */
const CONFIRM_MS = 2000;

/**
 * A button that copies a value to the clipboard. It confirms with a check mark and announces "Copied";
 * where the Clipboard API is missing or refuses (insecure pages, denied permission) it shows and announces
 * a message asking the user to copy the text themselves. `copied` and `copyFailed` let you add a toast.
 *
 * @example
 * <lg-copy-button [value]="hash()" label="Copy hash" />
 * <lg-copy-button [value]="css()" showLabel variant="secondary" />
 */
@Component({
  selector: 'lg-copy-button',
  imports: [LgButton],
  host: { class: 'inline-flex flex-wrap items-center gap-2' },
  template: `
    <button
      lgButton
      type="button"
      [variant]="variant()"
      [shape]="showLabel() ? 'default' : 'circle'"
      [attr.aria-label]="showLabel() ? null : label() || i18n.copy"
      (click)="copy()"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        @if (confirmed()) {
          <path d="M20 6 9 17l-5-5" />
        } @else {
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
        }
      </svg>
      @if (showLabel()) {
        {{ confirmed() ? i18n.copied : label() || i18n.copy }}
      }
    </button>
    <span aria-live="polite" [class]="failed() ? 'text-sm font-medium text-lg-danger' : 'sr-only'">{{ announcement() }}</span>
  `,
})
export class LgCopyButton {
  protected readonly i18n = inject(LG_I18N);

  /** The text to copy. */
  readonly value = input.required<string>();
  /** The button's name, e.g. "Copy hash". Defaults to "Copy". */
  readonly label = input('');
  /** Shows the label next to the icon; otherwise the button is a round icon button named by it. */
  readonly showLabel = input(false, { transform: booleanAttribute });
  readonly variant = input<LgButtonVariant>('ghost');

  /** The value was copied. */
  readonly copied = output<string>();
  /** Copying failed; the user was asked to copy the value themselves. */
  readonly copyFailed = output<unknown>();

  protected readonly confirmed = signal(false);
  protected readonly failed = signal(false);
  protected readonly announcement = signal('');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.timer);
    });
  }

  /** Copies `value`, as a click does. */
  async copy(): Promise<void> {
    const value = this.value();
    try {
      // Missing outside secure contexts; `writeText` rejects without permission.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- not in every browser or context
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(value);
    } catch (error: unknown) {
      clearTimeout(this.timer);
      this.confirmed.set(false);
      this.failed.set(true);
      this.announcement.update((previous) => lgAnnouncement(previous, this.i18n.copyFailed));
      this.copyFailed.emit(error);
      return;
    }
    this.failed.set(false);
    this.confirmed.set(true);
    this.announcement.update((previous) => lgAnnouncement(previous, this.i18n.copied));
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.confirmed.set(false);
    }, CONFIRM_MS);
    this.copied.emit(value);
  }
}
