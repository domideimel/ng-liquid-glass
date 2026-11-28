`[lgOutput]` is a read-only result surface for hashes, encoded text, converted documents or generated CSS. It keeps line breaks and wraps long values anywhere, so a 64-character hash never overflows on a phone. Add `mono` for code and encoded values.

Use it on `<output>` for a value computed from the form (link it with `for`), `<pre>` for documents, or `<p>` and `<div>`. Give it a name with `aria-labelledby` or `aria-label`. Add `aria-live="polite"` only when the result changes without the user typing, e.g. after a server call.

{{ NgDocActions.demo("OutputDemo") }}
