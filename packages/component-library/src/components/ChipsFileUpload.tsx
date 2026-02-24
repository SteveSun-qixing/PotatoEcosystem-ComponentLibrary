import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { cx } from '../utils/cx';

export interface ChipsFileUploadError {
  code:
    | 'FILE_EXTENSION_NOT_ALLOWED'
    | 'FILE_MISSING'
    | 'FILE_DISABLED'
    | 'FILE_READ_FAILED';
  message: string;
  details?: Record<string, unknown>;
}

export interface ChipsFileUploadProps {
  value?: File | null;
  defaultValue?: File | null;
  disabled?: boolean;
  acceptExtensions?: string[];
  multiple?: boolean;
  chipsScope?: string;
  onChange?: (file: File | null) => void;
  onError?: (error: ChipsFileUploadError) => void;
  onDragStateChange?: (dragging: boolean) => void;
}

const normalizeExtensions = (extensions: string[]): string[] =>
  extensions
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0)
    .map((entry) => (entry.startsWith('.') ? entry : `.${entry}`));

const extensionAllowed = (fileName: string, allowed: string[]): boolean => {
  if (allowed.length === 0) {
    return true;
  }

  const normalized = fileName.toLowerCase();
  return allowed.some((extension) => normalized.endsWith(extension));
};

export function ChipsFileUpload({
  value,
  defaultValue = null,
  disabled = false,
  acceptExtensions = [],
  multiple = false,
  chipsScope = 'chips-file-upload',
  onChange,
  onError,
  onDragStateChange
}: ChipsFileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [internalValue, setInternalValue] = useState<File | null>(defaultValue);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<ChipsFileUploadError | null>(null);

  const isControlled = value !== undefined;
  const selectedFile = isControlled ? value : internalValue;
  const allowedExtensions = normalizeExtensions(acceptExtensions);
  const accept = allowedExtensions.length > 0 ? allowedExtensions.join(',') : undefined;

  const emitError = (nextError: ChipsFileUploadError): void => {
    setError(nextError);
    onError?.(nextError);
  };

  const setDragState = (next: boolean): void => {
    if (dragging === next) {
      return;
    }
    setDragging(next);
    onDragStateChange?.(next);
  };

  const updateValue = (next: File | null): void => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const readFile = (nextFile: File | null): void => {
    if (disabled) {
      emitError({
        code: 'FILE_DISABLED',
        message: 'File upload is disabled.'
      });
      return;
    }

    if (!nextFile) {
      emitError({
        code: 'FILE_MISSING',
        message: 'No file selected.'
      });
      updateValue(null);
      return;
    }

    if (!extensionAllowed(nextFile.name, allowedExtensions)) {
      emitError({
        code: 'FILE_EXTENSION_NOT_ALLOWED',
        message: `File extension is not allowed: ${nextFile.name}`,
        details: {
          fileName: nextFile.name,
          acceptExtensions: allowedExtensions
        }
      });
      updateValue(null);
      return;
    }

    try {
      setError(null);
      updateValue(nextFile);
    } catch (cause) {
      emitError({
        code: 'FILE_READ_FAILED',
        message: 'Failed to read selected file.',
        details: {
          cause
        }
      });
    }
  };

  const openFilePicker = (): void => {
    if (disabled) {
      emitError({
        code: 'FILE_DISABLED',
        message: 'File upload is disabled.'
      });
      return;
    }

    inputRef.current?.click();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null;
    readFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragState(false);

    if (disabled) {
      emitError({
        code: 'FILE_DISABLED',
        message: 'File upload is disabled.'
      });
      return;
    }

    const files = event.dataTransfer?.files;
    const file = files && files.length > 0 ? (files[0] ?? null) : null;
    readFile(file);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!disabled) {
      setDragState(true);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!disabled) {
      setDragState(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDragState(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFilePicker();
    }
  };

  const state: 'idle' | 'dragging' | 'disabled' | 'invalid' | 'selected' = disabled
    ? 'disabled'
    : error
      ? 'invalid'
      : dragging
        ? 'dragging'
        : selectedFile
          ? 'selected'
          : 'idle';

  return (
    <div
      className={cx(
        'chips-file-upload',
        disabled && 'chips-file-upload--disabled',
        dragging && 'chips-file-upload--dragging',
        error && 'chips-file-upload--invalid',
        selectedFile && 'chips-file-upload--has-file'
      )}
      data-scope={chipsScope}
      data-part="root"
      data-state={state}
    >
      <div
        className="chips-file-upload__dropzone"
        data-part="dropzone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-invalid={error ? true : undefined}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          className="chips-file-upload__input"
          data-part="input"
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={handleInputChange}
        />
      </div>
      <div className="chips-file-upload__meta" data-part="meta" aria-live="polite">
        {selectedFile ? selectedFile.name : ''}
        {error ? ` ${error.message}` : ''}
      </div>
    </div>
  );
}
