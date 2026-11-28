/**
 * Whether a file matches an `accept` list, by the native attribute's rules: extensions (`.pdf`), exact
 * MIME types (`application/json`) and `type/*`. An empty list accepts everything.
 *
 * @example
 * lgAcceptsFile(file, '.json,application/json');
 */
export function lgAcceptsFile(file: File, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) =>
    rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule,
  );
}
