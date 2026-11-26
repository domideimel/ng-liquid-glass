import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, Injectable, InjectionToken, PLATFORM_ID, signal, type Provider } from '@angular/core';
import { LG_I18N, lgUniqueId } from '@domideimel/ng-liquid-glass';

export type LgThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'lg-theme';

export interface LgThemeOptions {
  /**
   * Keep `<meta name="theme-color">` equal to the page background (`--lg-bg`), so an installed PWA's
   * status bar follows the theme, including system changes while in `system` mode. Creates the meta tag
   * when it's missing.
   */
  readonly syncThemeColor?: boolean;
}

export const LG_THEME_OPTIONS = new InjectionToken<LgThemeOptions>('LG_THEME_OPTIONS', { factory: () => ({}) });

/** Configures `LgTheme`, e.g. `provideLgTheme({ syncThemeColor: true })` in the app config. */
export function provideLgTheme(options: LgThemeOptions): Provider {
  return { provide: LG_THEME_OPTIONS, useValue: options };
}

/**
 * The colour scheme: `light`, `dark`, or `system` (follows the operating system). Setting it updates
 * `data-theme` on `<html>` and remembers the choice in `localStorage`. Safe to use with SSR.
 */
@Injectable({ providedIn: 'root' })
export class LgTheme {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly options = inject(LG_THEME_OPTIONS);
  private readonly current = signal<LgThemeMode>(this.stored());
  readonly mode = this.current.asReadonly();

  constructor() {
    this.apply(this.current());
    if (this.browser && this.options.syncThemeColor) {
      // In system mode the background changes with the operating system's setting.
      this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        this.syncThemeColor();
      });
    }
  }

  set(mode: LgThemeMode): void {
    this.current.set(mode);
    this.apply(mode);
    if (this.browser) {
      try {
        if (mode === 'system') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // Storage can be unavailable (privacy mode); the choice then lasts for this page only.
      }
    }
  }

  private stored(): LgThemeMode {
    if (!this.browser) return 'system';
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
      return 'system';
    }
  }

  private apply(mode: LgThemeMode): void {
    const root = this.document.documentElement;
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    this.syncThemeColor();
  }

  private syncThemeColor(): void {
    if (!this.browser || !this.options.syncThemeColor) return;
    const doc = this.document;
    const background = doc.defaultView?.getComputedStyle(doc.documentElement).backgroundColor;
    if (!background) return;
    let meta = doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = doc.createElement('meta');
      meta.name = 'theme-color';
      doc.head.append(meta);
    }
    meta.content = background;
  }
}

/**
 * Lets users pick light, dark or system colours: a segmented control of native radio buttons, bound
 * to `LgTheme`.
 *
 * @example
 * <lg-theme-switcher />
 */
@Component({
  selector: 'lg-theme-switcher',
  host: { class: 'inline-block' },
  template: `
    <fieldset
      class="m-0 inline-flex min-w-0 flex-wrap gap-1 rounded-lg-surface border-0 bg-lg-surface-muted p-1 forced-colors:border forced-colors:border-[CanvasText]"
    >
      <legend class="sr-only">{{ i18n.theme }}</legend>
      @for (option of options; track option.mode) {
        <label
          class="relative inline-flex min-h-lg-control min-w-lg-control cursor-pointer items-center justify-center gap-2 rounded-lg-control border border-transparent px-lg-control-px-sm font-medium text-lg-fg-muted hover:text-lg-fg has-checked:border-lg-control-border has-checked:bg-lg-surface has-checked:text-lg-fg has-checked:shadow-sm has-checked:lg-forced-selected has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-lg-focus [&>input]:sr-only"
        >
          <input
            type="radio"
            [name]="name"
            [value]="option.mode"
            [checked]="theme.mode() === option.mode"
            (change)="theme.set(option.mode)"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path [attr.d]="option.icon" />
          </svg>
          {{ option.label() }}
        </label>
      }
    </fieldset>
  `,
})
export class LgThemeSwitcher {
  protected readonly theme = inject(LgTheme);
  protected readonly i18n = inject(LG_I18N);
  protected readonly name = lgUniqueId('lg-theme');
  protected readonly options = [
    {
      mode: 'light' as const,
      label: () => this.i18n.themeLight,
      icon: 'M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5 19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5 19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    },
    { mode: 'dark' as const, label: () => this.i18n.themeDark, icon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z' },
    { mode: 'system' as const, label: () => this.i18n.themeSystem, icon: 'M4 5h16v11H4zM8 20h8M12 16v4' },
  ];
}
