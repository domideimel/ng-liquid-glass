import { Component, signal } from '@angular/core';
import { LgFormField, LgLabel } from '@domideimel/ng-liquid-glass/forms';
import { render, screen } from '@testing-library/angular';
import { expectNoA11yViolations } from '../../test/a11y';
import { lgAcceptsFile } from './accept';
import { LgFileDrop } from './file-drop';
import { LgFileInput } from './file-input';

function drag(target: Element, type: 'dragenter' | 'dragover' | 'dragleave' | 'drop', ...files: File[]): DragEvent {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  const event = new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

const json = new File(['{}'], 'data.json', { type: 'application/json' });
const other = new File(['{}'], 'more.json', { type: 'application/json' });
const png = new File(['x'], 'photo.png', { type: 'image/png' });

@Component({
  imports: [LgFileDrop],
  template: `
    <section
      data-testid="zone"
      aria-label="Document"
      lgFileDropAccept=".json"
      [lgFileDropSingle]="single()"
      [lgFileDropDisabled]="disabled()"
      (lgFileDrop)="dropped.set($event)"
      (lgFileDropRejected)="rejected.set($event)"
    >
      <label>Text <textarea></textarea></label>
    </section>
  `,
})
class Zone {
  readonly single = signal(false);
  readonly disabled = signal(false);
  readonly dropped = signal<readonly File[]>([]);
  readonly rejected = signal<readonly File[]>([]);
}

async function setup() {
  const view = await render(Zone);
  return { ...view, zone: screen.getByTestId('zone'), host: view.fixture.componentInstance };
}

describe('LgFileDrop', () => {
  it('shows the drag state while files are over the area, also across its children', async () => {
    const { zone, fixture } = await setup();
    const textarea = screen.getByRole('textbox');
    expect(drag(zone, 'dragenter', json).defaultPrevented).toBe(true);
    drag(textarea, 'dragenter', json);
    drag(zone, 'dragleave');
    await fixture.whenStable();
    expect(zone).toHaveAttribute('data-dragging', 'true');
    expect(zone).toHaveClass('outline-dashed', 'outline-lg-primary');
    expect(drag(textarea, 'dragover', json).defaultPrevented).toBe(true);
    drag(textarea, 'dragleave');
    await fixture.whenStable();
    expect(zone).not.toHaveAttribute('data-dragging');
    expect(zone).not.toHaveClass('outline-dashed');
    // A stray dragleave doesn't go negative.
    drag(zone, 'dragleave');
    drag(zone, 'dragenter', json);
    await fixture.whenStable();
    expect(zone).toHaveAttribute('data-dragging', 'true');
    await expectNoA11yViolations();
  });

  it('emits accepted and rejected files on drop', async () => {
    const { zone, fixture, host } = await setup();
    drag(zone, 'dragenter', json);
    const drop = drag(screen.getByRole('textbox'), 'drop', json, png, other);
    await fixture.whenStable();
    expect(drop.defaultPrevented).toBe(true);
    expect(zone).not.toHaveAttribute('data-dragging');
    expect(host.dropped().map((file) => file.name)).toEqual(['data.json', 'more.json']);
    expect(host.rejected().map((file) => file.name)).toEqual(['photo.png']);

    host.single.set(true);
    host.dropped.set([]);
    host.rejected.set([]);
    fixture.detectChanges();
    drag(zone, 'drop', other, json);
    expect(host.dropped().map((file) => file.name)).toEqual(['more.json']);
    expect(host.rejected()).toEqual([]);
    host.dropped.set([]);
    drag(zone, 'drop', png);
    expect(host.dropped()).toEqual([]);
    expect(host.rejected().map((file) => file.name)).toEqual(['photo.png']);
  });

  it('ignores drags without files, and every drag while disabled', async () => {
    const { zone, fixture, host } = await setup();
    const text = new DataTransfer();
    text.setData('text/plain', 'hello');
    const textDrop = new DragEvent('drop', { dataTransfer: text, bubbles: true, cancelable: true });
    zone.dispatchEvent(textDrop);
    expect(textDrop.defaultPrevented).toBe(false);
    expect(drag(zone, 'dragenter').defaultPrevented).toBe(false);
    expect(drag(zone, 'dragover').defaultPrevented).toBe(false);

    host.disabled.set(true);
    fixture.detectChanges();
    expect(drag(zone, 'dragenter', json).defaultPrevented).toBe(false);
    expect(drag(zone, 'drop', json).defaultPrevented).toBe(false);
    await fixture.whenStable();
    expect(zone).not.toHaveAttribute('data-dragging');
    expect(host.dropped()).toEqual([]);
  });
});

describe('lgAcceptsFile', () => {
  it('matches extensions, exact types and wildcards', () => {
    expect(lgAcceptsFile(json, '')).toBe(true);
    expect(lgAcceptsFile(json, ' .JSON ')).toBe(true);
    expect(lgAcceptsFile(json, 'application/json')).toBe(true);
    expect(lgAcceptsFile(png, 'image/*')).toBe(true);
    expect(lgAcceptsFile(png, '.json,application/json')).toBe(false);
  });
});

describe('lg-file-input in a form field with a custom error', () => {
  it('is marked invalid and described by the error at once', async () => {
    await render(`<lg-form-field error="That file couldn't be read"><label lgLabel>Upload</label><lg-file-input /></lg-form-field>`, {
      imports: [LgFormField, LgLabel, LgFileInput],
    });
    const input = screen.getByLabelText('Upload');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription("That file couldn't be read");
  });
});
