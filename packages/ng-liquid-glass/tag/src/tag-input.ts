import { booleanAttribute, Component, type ElementRef, inject, input, model, signal, viewChild } from '@angular/core';
import { LG_I18N, lgAnnouncement } from '@domideimel/ng-liquid-glass';
import { LgCustomControl } from '@domideimel/ng-liquid-glass/forms';
import { LgTag } from './tag';

/**
 * A text input that collects a list of tags: Enter or comma adds the typed text, Backspace in the empty
 * input removes the last tag, and every tag has a remove button. Changes are announced. Works with
 * `[formField]` (Signal Forms) and `lg-form-field`.
 *
 * @example
 * <lg-form-field>
 *   <label lgLabel>Skills</label>
 *   <lg-tag-input [formField]="form.skills" />
 * </lg-form-field>
 */
@Component({
  selector: 'lg-tag-input',
  imports: [LgTag],
  host: { class: 'block' },
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -- a click on the frame focuses the input, which is keyboard reachable -->
    <div
      class="flex min-h-lg-control w-full flex-wrap items-center gap-1.5 rounded-lg-control border border-lg-control-border bg-lg-surface px-1.5 text-base text-lg-fg has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-lg-focus has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-60"
      [class.border-2]="showInvalid()"
      [class.border-lg-danger]="showInvalid()"
      (click)="focus()"
    >
      @if (value().length > 0) {
        <ul class="contents" role="list">
          @for (tag of value(); track tag; let i = $index) {
            <li class="flex">
              <lg-tag removable [disabled]="disabled()" (remove)="removeAt(i)">{{ tag }}</lg-tag>
            </li>
          }
        </ul>
      }
      <input
        #input
        type="text"
        enterkeyhint="enter"
        class="min-h-lg-control min-w-32 flex-1 border-0 bg-transparent px-1.5 font-[inherit] text-base text-lg-fg outline-none placeholder:text-lg-fg-muted"
        [id]="id"
        [value]="text()"
        [disabled]="disabled()"
        [attr.placeholder]="placeholder() || null"
        [attr.aria-describedby]="field?.describedBy()"
        [attr.aria-invalid]="showInvalid() || null"
        [attr.aria-required]="required() || null"
        (input)="text.set(input.value)"
        (keydown)="onKeydown($event)"
        (blur)="onBlur()"
      />
    </div>
    <span class="sr-only" aria-live="polite">{{ announcement() }}</span>
  `,
})
export class LgTagInput extends LgCustomControl<readonly string[]> {
  private readonly i18n = inject(LG_I18N);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  /** The tags. Bind with `[formField]` or `[(value)]`. */
  readonly value = model<readonly string[]>([]);
  readonly placeholder = input('');
  /** Allow the same text twice. */
  readonly allowDuplicates = input(false, { transform: booleanAttribute });

  readonly id = this.controlId('lg-tag-input');
  protected readonly text = signal('');
  protected readonly announcement = signal('');

  /** Moves focus to the text input. */
  override focus(options?: FocusOptions): void {
    this.input().nativeElement.focus(options);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if ((event.key === 'Enter' || event.key === ',') && this.text().trim() !== '') {
      event.preventDefault();
      this.commit();
    } else if (event.key === ',') {
      event.preventDefault();
    } else if (event.key === 'Backspace' && this.text() === '' && this.value().length > 0) {
      event.preventDefault();
      this.removeAt(this.value().length - 1);
    }
  }

  protected onBlur(): void {
    this.commit();
    this.touch.emit();
  }

  protected removeAt(index: number): void {
    const tag = this.value()[index];
    if (tag === undefined || this.disabled()) return;
    this.value.set(this.value().filter((_, i) => i !== index));
    this.announcement.update((previous) => lgAnnouncement(previous, this.i18n.tagRemoved(tag)));
    this.focus();
  }

  private commit(): void {
    const tag = this.text().trim();
    this.text.set('');
    if (tag === '' || (!this.allowDuplicates() && this.value().includes(tag))) return;
    this.value.set([...this.value(), tag]);
    this.announcement.update((previous) => lgAnnouncement(previous, this.i18n.tagAdded(tag)));
  }
}
