import { Component, computed, ElementRef, inject, Injectable, input, signal } from '@angular/core';
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

/** Why timers are paused; each source pauses and resumes independently. */
export type LgToastPauseReason = 'hover' | 'focus';

interface Timer {
  remaining: number;
  started: number;
  handle: ReturnType<typeof setTimeout> | undefined;
}

/** Shows notifications in the `<lg-toaster>` region. */
@Injectable({ providedIn: 'root' })
export class LgToaster {
  private nextId = 0;
  private readonly items = signal<readonly LgToast[]>([]);
  private readonly timers = new Map<number, Timer>();
  private readonly pauseReasons = signal<ReadonlySet<LgToastPauseReason>>(new Set());
  /** Whether timed toasts are paused, because the user hovers or focuses one. */
  readonly paused = computed(() => this.pauseReasons().size > 0);
  readonly toasts = this.items.asReadonly();

  /** Shows a toast and returns its id. */
  show(options: LgToastOptions): number {
    const id = ++this.nextId;
    this.items.update((items) => [...items, { id, message: options.message, status: options.status ?? 'info', action: options.action }]);
    const duration = options.duration ?? null;
    if (duration !== null) {
      this.timers.set(id, { remaining: duration, started: 0, handle: undefined });
      if (!this.paused()) this.start(id);
    }
    return id;
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id)?.handle);
    this.timers.delete(id);
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  /** Stops every timer, keeping each toast's remaining time. Used by the region on hover and focus. */
  pause(reason: LgToastPauseReason): void {
    const wasPaused = this.paused();
    this.pauseReasons.update((reasons) => new Set(reasons).add(reason));
    if (wasPaused) return;
    const now = Date.now();
    for (const timer of this.timers.values()) {
      clearTimeout(timer.handle);
      timer.handle = undefined;
      timer.remaining = Math.max(0, timer.remaining - (now - timer.started));
    }
  }

  /** Continues the timers once no reason to pause is left. */
  resume(reason: LgToastPauseReason): void {
    this.pauseReasons.update((reasons) => {
      const next = new Set(reasons);
      next.delete(reason);
      return next;
    });
    if (this.paused()) return;
    for (const id of this.timers.keys()) this.start(id);
  }

  private start(id: number): void {
    const timer = this.timers.get(id);
    if (!timer || timer.handle !== undefined) return;
    timer.started = Date.now();
    timer.handle = setTimeout(() => {
      this.dismiss(id);
    }, timer.remaining);
  }
}

/** One toast. Rendered by `lg-toaster`. */
@Component({
  selector: 'lg-toast',
  imports: [LgStatusIcon],
  host: {
    class:
      'lg-glass pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg-surface py-1.5 pe-1.5 ps-4 text-lg-fg shadow-xl',
  },
  template: `
    <lg-status-icon [status]="toast().status" [class]="iconClass()" />
    <p data-lg-part="message" class="m-0 flex-1 py-2">{{ toast().message }}</p>
    @if (toast().action; as action) {
      <button
        type="button"
        data-lg-part="action"
        class="lg-focus-ring min-h-lg-control cursor-pointer rounded-lg-control border border-transparent bg-transparent font-[inherit] text-base text-lg-fg px-3 font-medium underline underline-offset-4"
        (click)="runAction(action)"
      >
        {{ action.label }}
      </button>
    }
    <button
      type="button"
      data-lg-part="dismiss"
      class="lg-focus-ring inline-flex size-lg-control cursor-pointer border border-transparent bg-transparent text-lg-fg items-center justify-center rounded-lg-control hover:bg-lg-surface-muted"
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
  imports: [LgToastItem],
  host: {
    class: 'pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4',
    '[attr.aria-label]': 'i18n.notifications',
    role: 'region',
    '(pointerenter)': 'toaster.pause("hover")',
    '(pointerleave)': 'toaster.resume("hover")',
    '(focusin)': 'toaster.pause("focus")',
    '(focusout)': 'onFocusout($event)',
  },
  template: `
    <div role="status" class="flex w-full flex-col items-center gap-2">
      @for (toast of polite(); track toast.id) {
        <lg-toast [toast]="toast" />
      }
    </div>
    <div role="alert" class="flex w-full flex-col items-center gap-2">
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
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Resumes only when focus leaves the region, not when it moves between toasts. */
  protected onFocusout(event: FocusEvent): void {
    if (!(event.relatedTarget instanceof Node && this.element.contains(event.relatedTarget))) this.toaster.resume('focus');
  }
}
