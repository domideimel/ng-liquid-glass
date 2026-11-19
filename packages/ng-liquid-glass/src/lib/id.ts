let counter = 0;

/** Returns a document-unique id, used to connect labels, descriptions and popups via ARIA. */
export function lgUniqueId(prefix: string): string {
  counter += 1;
  return `${prefix}-${String(counter)}`;
}
