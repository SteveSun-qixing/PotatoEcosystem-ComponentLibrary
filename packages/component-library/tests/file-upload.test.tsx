import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ChipsFileUpload } from '../src/components/ChipsFileUpload';

const createFileList = (file: File): FileList =>
  ({
    0: file,
    length: 1,
    item: (index: number) => (index === 0 ? file : null)
  }) as unknown as FileList;

describe('ChipsFileUpload', () => {
  it('triggers hidden input click when dropzone is clicked', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
    render(<ChipsFileUpload />);

    fireEvent.click(screen.getByRole('button'));
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  it('switches dragging state during drag events', () => {
    const onDragStateChange = vi.fn();
    render(<ChipsFileUpload onDragStateChange={onDragStateChange} />);
    const dropzone = screen.getByRole('button');
    const root = dropzone.closest('.chips-file-upload');

    fireEvent.dragEnter(dropzone);
    expect(root?.getAttribute('data-state')).toBe('dragging');
    expect(onDragStateChange).toHaveBeenCalledWith(true);

    fireEvent.dragLeave(dropzone, { relatedTarget: null });
    expect(root?.getAttribute('data-state')).toBe('idle');
    expect(onDragStateChange).toHaveBeenCalledWith(false);
  });

  it('validates extension and emits onError', () => {
    const onError = vi.fn();
    const onChange = vi.fn();
    render(<ChipsFileUpload acceptExtensions={['.cpk']} onError={onError} onChange={onChange} />);

    const dropzone = screen.getByRole('button');
    const file = new File(['demo'], 'plugin.zip', { type: 'application/zip' });
    fireEvent.drop(dropzone, { dataTransfer: { files: createFileList(file) } });

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'FILE_EXTENSION_NOT_ALLOWED'
      })
    );
    expect(onChange).toHaveBeenCalledWith(null);
    expect(dropzone.closest('.chips-file-upload')?.getAttribute('data-state')).toBe('invalid');
  });

  it('blocks interactions when disabled', () => {
    const onError = vi.fn();
    const onChange = vi.fn();
    render(<ChipsFileUpload disabled onError={onError} onChange={onChange} />);

    const dropzone = screen.getByRole('button');
    const file = new File(['demo'], 'plugin.cpk', { type: 'application/octet-stream' });

    fireEvent.click(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: createFileList(file) } });

    expect(onChange).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'FILE_DISABLED'
      })
    );
    expect(dropzone.closest('.chips-file-upload')?.getAttribute('data-state')).toBe('disabled');
  });

  it('supports uncontrolled and controlled value flows', () => {
    const cpkFile = new File(['demo'], 'plugin.cpk', { type: 'application/octet-stream' });
    const nextFile = new File(['theme'], 'theme.cpk', { type: 'application/octet-stream' });

    const { rerender } = render(<ChipsFileUpload acceptExtensions={['.cpk']} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    expect(input).not.toBeNull();
    if (!input) {
      return;
    }
    Object.defineProperty(input, 'files', { value: createFileList(cpkFile), configurable: true });
    fireEvent.change(input);
    expect(screen.getByText(/plugin\.cpk/)).toBeTruthy();

    rerender(<ChipsFileUpload value={nextFile} acceptExtensions={['.cpk']} />);
    expect(screen.getByText(/theme\.cpk/)).toBeTruthy();
  });
});
