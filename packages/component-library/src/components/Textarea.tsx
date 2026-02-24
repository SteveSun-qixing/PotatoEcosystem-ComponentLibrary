import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface ChipsTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  invalid?: boolean;
  chipsScope?: string;
}

export const ChipsTextarea = forwardRef<HTMLTextAreaElement, ChipsTextareaProps>(function ChipsTextarea(
  { label, helperText, errorText, invalid = false, chipsScope = 'chips-textarea', className, id, ...props },
  ref,
) {
  const controlId = id ?? (label ? `chips-textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="chips-textarea-field" data-scope={chipsScope} data-part="root">
      {label ? (
        <label className="chips-textarea-field__label" data-part="label" htmlFor={controlId}>
          {label}
        </label>
      ) : null}
      <textarea
        {...props}
        ref={ref}
        id={controlId}
        className={cx('chips-textarea', invalid ? 'chips-textarea--error' : null, className)}
        data-part="control"
        aria-invalid={invalid || undefined}
      />
      {helperText ? (
        <span className="chips-textarea-field__helper" data-part="helper">
          {helperText}
        </span>
      ) : null}
      {errorText ? (
        <span className="chips-textarea-field__error" data-part="error">
          {errorText}
        </span>
      ) : null}
    </div>
  );
});
