import { Component, signal } from '@angular/core';
import { form, FormField, minLength } from '@angular/forms/signals';
import { LgFormField, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { LgFileInput } from './file-input';

@Component({
  imports: [FormField, LgFileInput, LgFormField, LgLabel],
  template: `
    <lg-form-field>
      <label lgLabel>Attachments</label>
      <lg-file-input multiple accept=".pdf,image/*" [formField]="message.attachments" />
    </lg-form-field>
  `,
})
class Upload {
  readonly model = signal<{ attachments: readonly File[] }>({ attachments: [] });
  readonly message = form(this.model, (path) => {
    minLength(path.attachments, 1, { message: 'Attach at least one file' });
  });
}

const pdf = new File(['%PDF'], 'report.pdf', { type: 'application/pdf' });
const png = new File([new Uint8Array(2048)], 'photo.png', { type: 'image/png' });
const zip = new File(['PK'], 'archive.zip', { type: 'application/zip' });

/** Dispatched directly: fireEvent would copy the DataTransfer into an empty one. */
function drag(target: Element, type: 'dragover' | 'dragleave' | 'drop', ...files: File[]): void {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  target.dispatchEvent(new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true }));
}

async function setup() {
  const view = await render(Upload);
  const input = screen.getByLabelText(/Attachments/);
  return { ...view, input, model: view.fixture.componentInstance.model };
}

describe('LgFileInput', () => {
  it('is a native file input named by the field and its button', async () => {
    const { input } = await setup();
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', '.pdf,image/*');
    expect(input).toHaveAccessibleName('Attachments Choose files');
    await expectNoA11yViolations();
  });

  it('adds chosen files, skips duplicates, lists and announces them', async () => {
    const { input, model } = await setup();
    await userEvent.upload(input, [pdf]);
    await userEvent.upload(input, [pdf, png]);
    expect(model().attachments.map((file) => file.name)).toEqual(['report.pdf', 'photo.png']);
    expect(screen.getByText('2 files selected')).toBeInTheDocument();
    expect(screen.getByText('photo.png (2 KB)')).toBeInTheDocument();
    expect(screen.getByText('report.pdf (4 B)')).toBeInTheDocument();
    await expectNoA11yViolations();
  });

  it('rejects picked files that bypass accept with "All files"', async () => {
    const view = await render(Upload);
    const input = screen.getByLabelText(/Attachments/);
    const user = userEvent.setup({ applyAccept: false });
    await user.upload(input, [zip]);
    expect(view.fixture.componentInstance.model().attachments).toEqual([]);
    expect(screen.getByText('Not an accepted file type: archive.zip', { selector: 'p' })).toBeVisible();
    expect(screen.getByText('Not an accepted file type: archive.zip', { selector: '[aria-live]' })).toBeInTheDocument();
  });

  it('removes files and returns focus to the input', async () => {
    const { input, model } = await setup();
    await userEvent.upload(input, [pdf, png]);
    await userEvent.click(screen.getByRole('button', { name: /Remove report\.pdf/ }));
    expect(model().attachments.map((file) => file.name)).toEqual(['photo.png']);
    expect(input).toHaveFocus();
    expect(screen.getByText('report.pdf removed')).toBeInTheDocument();
  });

  it('accepts dropped files that match accept', async () => {
    const { model, input, fixture } = await setup();
    const zone = input.closest('label')!.parentElement!;
    drag(zone, 'dragover');
    await fixture.whenStable();
    expect(zone).toHaveClass('border-lg-primary');
    drag(zone, 'dragleave');
    await fixture.whenStable();
    expect(zone).not.toHaveClass('border-lg-primary');
    drag(zone, 'drop', zip, png, pdf);
    await fixture.whenStable();
    expect(model().attachments.map((file) => file.name)).toEqual(['photo.png', 'report.pdf']);
    // Rejected files are reported, visibly and through the live region.
    expect(screen.getByText('Not an accepted file type: archive.zip')).toBeVisible();
    expect(screen.getByText('2 files selected. Not an accepted file type: archive.zip')).toBeInTheDocument();
    drag(zone, 'drop', zip);
    await fixture.whenStable();
    expect(model().attachments).toHaveLength(2);
    drag(zone, 'drop', png);
    await fixture.whenStable();
    expect(screen.queryByText('Not an accepted file type: archive.zip')).toBeNull();
  });

  it('replaces the file when single, and shows the error once touched', async () => {
    await render(`<label for="cv">CV</label><lg-file-input [(value)]="files" />`, {
      imports: [LgFileInput],
      componentProperties: { files: signal<readonly File[]>([]) },
    });
    const input = screen.getByLabelText(/Choose files/);
    await userEvent.upload(input, [pdf]);
    await userEvent.upload(input, [png]);
    expect(screen.getByText(/photo\.png/)).toBeInTheDocument();
    expect(screen.queryByText(/report\.pdf/)).toBeNull();
    expect(screen.getByText('1 file selected')).toBeInTheDocument();
  });

  it('marks the field invalid once touched', async () => {
    const { input, fixture } = await setup();
    input.focus();
    input.blur();
    fixture.detectChanges();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Attach at least one file')).toBeInTheDocument();
  });

  it('ignores drops while disabled', async () => {
    const { fixture } = await render(`<lg-file-input disabled [(value)]="files" />`, {
      imports: [LgFileInput],
      componentProperties: { files: signal<readonly File[]>([]) },
    });
    const zone = screen.getByText('Choose files').closest('label')!.parentElement!;
    drag(zone, 'dragover');
    await fixture.whenStable();
    expect(zone).not.toHaveClass('border-lg-primary');
    drag(zone, 'drop', pdf);
    await fixture.whenStable();
    expect(screen.queryByText(/report\.pdf/)).toBeNull();
  });
});
