import { inject, Injectable } from '@angular/core';

/** Counter per application, so each server-rendered request starts from 1 like the client does. */
@Injectable({ providedIn: 'root' })
export class LgIdCounter {
  private count = 0;

  next(): number {
    return ++this.count;
  }
}

let fallback = 0;

/**
 * Returns a document-unique id, used to connect labels, descriptions and popups via ARIA. Inside an
 * injection context (component fields) it counts per application; elsewhere it uses a module counter.
 */
export function lgUniqueId(prefix: string): string {
  let counter: LgIdCounter | null = null;
  try {
    counter = inject(LgIdCounter);
  } catch {
    // Not in an injection context.
  }
  return `${prefix}-${String(counter ? counter.next() : ++fallback)}`;
}
