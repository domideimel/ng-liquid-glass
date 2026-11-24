import { booleanAttribute, Component, type ElementRef, inject, input, model, signal, viewChild } from '@angular/core';
import { LG_I18N, lgAnnouncement } from '@domideimel/ng-liquid-glass';
import { LgCustomControl } from '@domideimel/ng-liquid-glass/forms';
import { LgTag } from '@domideimel/ng-liquid-glass/tag';

/**
 * File selection built on the native `<input type="file">`, so keyboard and screen readers get the
 * browser's own control. Files can also be dropped onto it. Selected files are listed with remove
 * buttons and changes are announced. Works with `[formField]` and `lg-form-field`.
 *
 * @example
 * <lg-form-field>
 *   <label lgLabel>Attachments</label>
 *   <lg-file-input multiple accept=".pdf,image/*" [formField]="form.attachments" />
 * </lg-form-field>
 */
@Component({
  selector: 'lg-file-input',
  imports: [LgTag],
  host: { class: 'block' },
  template: `
    <div
      class="flex flex-col items-center gap-2 rounded-lg-surface border-2 border-dashed p-6 text-center"
      [class]="dragging() ? 'border-lg-primary bg-lg-surface-muted' : showInvalid() ? 'border-lg-danger' : 'border-lg-control-border'"
      (dragover)="onDragover($event)"
      (dragleave)="dragging.set(false)"
      (drop)="onDrop($event)"
    >
      <label
        class="inline-flex min-h-lg-control cursor-pointer items-center justify-center gap-2 rounded-lg-control border border-lg-control-border bg-lg-surface px-4 font-medium text-lg-fg hover:bg-lg-surface-muted has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-lg-focus has-disabled:cursor-not-allowed has-disabled:opacity-60"
      >
        <input
          #input
          type="file"
          class="sr-only"
          [id]="id"
          [multiple]="multiple()"
          [disabled]="disabled()"
          [attr.accept]="accept() || null"
          [attr.aria-describedby]="field?.describedBy()"
          [attr.aria-invalid]="showInvalid() || null"
          [attr.aria-required]="required() || null"
          (change)="onChange(input)"
          (blur)="touch.emit()"
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
          stroke-linejoin="round"
        >
          <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
        </svg>
        {{ i18n.chooseFiles }}
      </label>
      <p aria-hidden="true" class="m-0 text-sm text-lg-fg-muted">{{ i18n.dropFiles }}</p>
      @if (rejected()) {
        <p aria-hidden="true" class="m-0 text-sm font-medium text-lg-danger">{{ rejected() }}</p>
      }
    </div>
    @if (value().length > 0) {
      <ul class="m-0 mt-2 flex list-none flex-wrap gap-1.5 p-0">
        @for (file of value(); track $index; let i = $index) {
          <li class="flex">
            <lg-tag removable [disabled]="disabled()" (remove)="removeAt(i)">{{ file.name }} ({{ size(file.size) }})</lg-tag>
          </li>
        }
      </ul>
    }
    <span class="sr-only" aria-live="polite">{{ announcement() }}</span>
  `,
})
export class LgFileInput extends LgCustomControl<readonly File[]> {
  protected readonly i18n = inject(LG_I18N);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  /** The selected files. Bind with `[formField]` or `[(value)]`. */
  readonly value = model<readonly File[]>([]);
  /** Allow several files; new ones are added to the list. */
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Accepted types, as in the native `accept` attribute (`.pdf,image/*`). Also applied to dropped files. */
  readonly accept = input('');

  readonly id = this.controlId('lg-file-input');
  protected readonly dragging = signal(false);
  protected readonly announcement = signal('');
  /** Message about the last files that didn't match `accept`; announced through the live region too. */
  protected readonly rejected = signal('');

  /** Moves focus to the native file input. */
  override focus(options?: FocusOptions): void {
    this.input().nativeElement.focus(options);
  }

  protected onChange(input: HTMLInputElement): void {
    this.add([...(input.files ?? [])]);
    // Clear the native selection, so choosing the same file again fires `change`.
    input.value = '';
  }

  protected onDragover(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    if (this.disabled()) return;
    this.add([...(event.dataTransfer?.files ?? [])]);
    this.touch.emit();
  }

  protected removeAt(index: number): void {
    const file = this.value()[index];
    if (file === undefined) return;
    this.value.set(this.value().filter((_, i) => i !== index));
    this.announcement.update((previous) => lgAnnouncement(previous, this.i18n.tagRemoved(file.name)));
    this.focus();
  }

  protected size(bytes: number): string {
    if (bytes < 1024) return `${String(bytes)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  /** Adds the accepted files; rejected ones (dropped, or picked with "All files") are reported instead. */
  private add(candidates: File[]): void {
    if (candidates.length === 0) return;
    const files = candidates.filter((file) => this.accepts(file));
    const rejected = candidates.filter((file) => !this.accepts(file)).map((file) => file.name);
    this.rejected.set(rejected.length > 0 ? this.i18n.filesRejected(rejected.join(', ')) : '');
    if (files.length === 0) {
      this.announcement.update((previous) => lgAnnouncement(previous, this.rejected()));
      return;
    }
    const key = (file: File): string => `${file.name}:${String(file.size)}:${String(file.lastModified)}`;
    if (this.multiple()) {
      const existing = new Set(this.value().map(key));
      this.value.set([...this.value(), ...files.filter((file) => !existing.has(key(file)))]);
    } else {
      this.value.set(files.slice(0, 1));
    }
    const message = [this.i18n.filesSelected(this.value().length), this.rejected()].filter(Boolean).join('. ');
    this.announcement.update((previous) => lgAnnouncement(previous, message));
  }

  /** Same rules as the native `accept` attribute: extensions, exact MIME types and `type/*`. */
  private accepts(file: File): boolean {
    const rules = this.accept()
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
}
