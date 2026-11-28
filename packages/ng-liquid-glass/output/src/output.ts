import { booleanAttribute, Directive, input } from '@angular/core';

/**
 * A read-only result surface for hashes, encoded text, converted documents or generated code. It keeps
 * line breaks and wraps long values anywhere, so nothing overflows. Use it on `<output>` (announced to
 * screen readers when it changes, if you add `aria-live`), `<pre>`, `<p>` or `<div>`.
 *
 * @example
 * <output lgOutput mono for="input" aria-live="polite">{{ hash() }}</output>
 * <pre lgOutput>{{ yaml() }}</pre>
 */
@Directive({
  selector: 'output[lgOutput], pre[lgOutput], p[lgOutput], div[lgOutput]',
  host: {
    class:
      'm-0 block min-h-lg-control rounded-lg-control border border-lg-border bg-lg-surface-muted px-3 py-2 text-lg-fg whitespace-pre-wrap [overflow-wrap:anywhere] forced-colors:border-[CanvasText]',
    '[class]': 'mono() ? "font-mono text-sm" : "font-[inherit] text-base"',
  },
})
export class LgOutput {
  /** Monospace text, for code, hashes and encoded values. */
  readonly mono = input(false, { transform: booleanAttribute });
}
