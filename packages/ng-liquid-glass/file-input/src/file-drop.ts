import { booleanAttribute, Directive, input, output, signal } from '@angular/core';
import { lgAcceptsFile } from './accept';

/**
 * Makes an area a drop target for files, e.g. the card around a text area that a file fills. While files
 * are dragged over it, it shows a dashed outline and gets `data-dragging`. Dropping is a pointer-only
 * shortcut, so keep a keyboard route next to it: a file input (`lg-file-input` or a native one).
 *
 * @example
 * <section lgCard (lgFileDrop)="load($event)" lgFileDropAccept=".json,application/json">
 *   <lg-form-field>
 *     <label lgLabel>JSON</label>
 *     <textarea lgInput [formField]="form.json"></textarea>
 *   </lg-form-field>
 *   <input type="file" accept=".json" aria-label="Open a JSON file" (change)="pick($event)" />
 * </section>
 */
@Directive({
  selector: '[lgFileDrop]',
  exportAs: 'lgFileDrop',
  host: {
    '[attr.data-dragging]': 'dragging() || null',
    '[class.outline-3]': 'dragging()',
    '[class.outline-dashed]': 'dragging()',
    '[class.outline-offset-2]': 'dragging()',
    '[class.outline-lg-primary]': 'dragging()',
    '(dragenter)': 'onDragenter($event)',
    '(dragover)': 'onDragover($event)',
    '(dragleave)': 'onDragleave()',
    '(drop)': 'onDrop($event)',
  },
})
export class LgFileDrop {
  /** Accepted types, as in the native `accept` attribute. Other files are emitted by `lgFileDropRejected`. */
  readonly lgFileDropAccept = input('');
  /** Emit only the first accepted file. */
  readonly lgFileDropSingle = input(false, { transform: booleanAttribute });
  /** Ignores drags, e.g. while the field it fills is disabled. */
  readonly lgFileDropDisabled = input(false, { transform: booleanAttribute });

  /** The dropped files that match `lgFileDropAccept`. Not emitted when none do. */
  readonly lgFileDrop = output<readonly File[]>();
  /** The dropped files that don't match `lgFileDropAccept`. */
  readonly lgFileDropRejected = output<readonly File[]>();

  /** Whether files are being dragged over the area. */
  readonly dragging = signal(false);
  /** `dragenter` and `dragleave` also fire for every child, so count them. */
  private depth = 0;

  protected onDragenter(event: DragEvent): void {
    if (!this.carriesFiles(event)) return;
    event.preventDefault();
    this.depth++;
    this.dragging.set(true);
  }

  protected onDragover(event: DragEvent): void {
    if (!this.carriesFiles(event)) return;
    // Cancelling dragover is what makes the element a drop target.
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  protected onDragleave(): void {
    if (this.depth === 0) return;
    this.depth--;
    if (this.depth === 0) this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    if (!this.carriesFiles(event)) return;
    // Otherwise the browser opens the file, or a text area inserts its path.
    event.preventDefault();
    this.depth = 0;
    this.dragging.set(false);
    const files = [...(event.dataTransfer?.files ?? [])];
    const accepted = files.filter((file) => lgAcceptsFile(file, this.lgFileDropAccept()));
    const rejected = files.filter((file) => !accepted.includes(file));
    if (rejected.length > 0) this.lgFileDropRejected.emit(rejected);
    if (accepted.length > 0) this.lgFileDrop.emit(this.lgFileDropSingle() ? accepted.slice(0, 1) : accepted);
  }

  private carriesFiles(event: DragEvent): boolean {
    return !this.lgFileDropDisabled() && (event.dataTransfer?.types.includes('Files') ?? false);
  }
}
