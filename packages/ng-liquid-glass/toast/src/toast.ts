import { ChangeDetectionStrategy, Component, computed, inject, Injectable, input, signal } from '@angular/core';
import { LG_I18N, LgStatusIcon, type LgStatus } from '@domideimel/ng-liquid-glass';

export interface LgToastAction {
  readonly label: string;
  readonly run: () => void;
}

export interface LgToastOptions {
  readonly message: string;
  readonly status?: LgStatus;
  /**
   * Milliseconds until the toast closes itself. Defaults to `null` (stays until dismissed), which
   * satisfies WCAG 2.2.3 No Timing (AAA). Timers pause while a toast is hovered or focused.
   */
  readonly duration?: number | null;
  readonly action?: LgToastAction;
}

export interface LgToast {
  readonly id: number;
  readonly message: string;
  readonly status: LgStatus;
  readonly action: LgToastAction | undefined;
}

/** Shows notifications in the `<lg-toaster>` region. */
@Injectable({ providedIn: 'root' })
export class LgToaster {
  private nextId = 0;
  private readonly items = signal<readonly LgToast[]>([]);
  /** Set by the region while the user hovers or focuses a toast. */
  readonly paused = signal(false);
  readonly toasts = this.items.asReadonly();

  /** Shows a toast and returns its id. */
  show(options: LgToastOptions): number {
    const id = ++this.nextId;
    this.items.update((items) => [...items, { id, message: options.message, status: options.status ?? 'info', action: options.action }]);
    const duration = options.duration ?? null;
    if (duration !== null) this.expire(id, duration);
    return id;
  }

  dismiss(id: number): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  private expire(id: number, duration: number): void {
    setTimeout(() => {
      if (this.paused()) this.expire(id, 1000);
      else this.dismiss(id);
    }, duration);
  }
}

/** One toast. Rendered by `lg-toaster`. */
@Component({
  selector: 'lg-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgStatusIcon],
  host: {
    class:
      'lg-glass pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg-surface py-1.5 pr-1.5 pl-4 text-lg-fg shadow-xl',
  },
  template: `
    <lg-status-icon [status]="toast().status" [class]="iconClass()" />
    <p class="m-0 flex-1 py-2">{{ toast().message }}</p>
    @if (toast().action; as action) {
      <button
        type="button"
        class="lg-focus-ring min-h-11 cursor-pointer rounded-lg-control border-0 bg-transparent font-[inherit] text-base text-lg-fg px-3 font-medium underline underline-offset-4"
        (click)="runAction(action)"
      >
        {{ action.label }}
      </button>
    }
    <button
      type="button"
      class="lg-focus-ring inline-flex size-11 cursor-pointer border-0 bg-transparent text-lg-fg items-center justify-center rounded-lg-control hover:bg-lg-surface-muted"
      [attr.aria-label]="i18n.dismiss"
      (click)="dismiss()"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  `,
})
export class LgToastItem {
  private readonly toaster = inject(LgToaster);
  protected readonly i18n = inject(LG_I18N);
  readonly toast = input.required<LgToast>();
  protected readonly iconClass = computed(() => ICON_CLASS[this.toast().status]);

  protected runAction(action: LgToastAction): void {
    action.run();
    this.dismiss();
  }

  protected dismiss(): void {
    this.toaster.dismiss(this.toast().id);
  }
}

const ICON_CLASS: Record<LgStatus, string> = {
  info: 'text-lg-info',
  success: 'text-lg-success',
  warning: 'text-lg-warning',
  danger: 'text-lg-danger',
};

/**
 * The live region that renders toasts. Add it once, at the end of your root template.
 * Errors are announced assertively, everything else politely.
 */
@Component({
  selector: 'lg-toaster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgToastItem],
  host: {
    class: 'pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4',
    '[attr.aria-label]': 'i18n.notifications',
    role: 'region',
    '(pointerenter)': 'toaster.paused.set(true)',
    '(pointerleave)': 'toaster.paused.set(false)',
    '(focusin)': 'toaster.paused.set(true)',
    '(focusout)': 'toaster.paused.set(false)',
  },
  template: `
    <div role="status" class="contents">
      @for (toast of polite(); track toast.id) {
        <lg-toast [toast]="toast" />
      }
    </div>
    <div role="alert" class="contents">
      @for (toast of assertive(); track toast.id) {
        <lg-toast [toast]="toast" />
      }
    </div>
  `,
})
export class LgToasterRegion {
  protected readonly toaster = inject(LgToaster);
  protected readonly i18n = inject(LG_I18N);
  protected readonly polite = computed(() => this.toaster.toasts().filter((toast) => toast.status !== 'danger'));
  protected readonly assertive = computed(() => this.toaster.toasts().filter((toast) => toast.status === 'danger'));
}
