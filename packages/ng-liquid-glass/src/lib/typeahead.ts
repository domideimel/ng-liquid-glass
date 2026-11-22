import { DestroyRef, inject } from '@angular/core';

const RESET_MS = 500;

/**
 * Type-ahead for lists (WAI-ARIA): characters typed within 500 ms form one query that jumps to the next
 * label starting with it; typing the same character again cycles through the labels starting with it.
 * Create it in an injection context (a field initializer); its timer is cleared when the owner is destroyed.
 */
export class LgTypeahead {
  private query = '';
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.reset();
    });
  }

  /** Whether a query is being typed, so a Space belongs to it rather than activating something. */
  get typing(): boolean {
    return this.query !== '';
  }

  /**
   * Handles a key press. Returns `null` when the key doesn't type (named keys, shortcuts), otherwise the
   * index of the next matching label after `current` (wrapping around), or -1 when nothing matches.
   */
  match(event: KeyboardEvent, labels: readonly string[], current: number): number | null {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return null;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.query = '';
    }, RESET_MS);
    this.query += event.key.toLocaleLowerCase();
    const repeated = /^(.)\1+$/u.test(this.query);
    const query = repeated ? this.query.charAt(0) : this.query;
    // A new query or a repeated character looks after the current label; a longer query may still match it.
    const step = repeated || this.query.length === 1 ? 1 : 0;
    const count = labels.length;
    for (let offset = 0; offset < count; offset++) {
      const index = (((current + step + offset) % count) + count) % count;
      if (labels[index]?.toLocaleLowerCase().startsWith(query)) return index;
    }
    return -1;
  }

  reset(): void {
    clearTimeout(this.timer);
    this.query = '';
  }
}
