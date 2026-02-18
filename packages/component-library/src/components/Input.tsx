import { Field } from '@ark-ui/react/field';
import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  invalid?: boolean;
  chipsScope?: string;
}

export function Input({
  label,
  helperText,
  errorText,
  invalid,
  chipsScope = 'input',
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = id ?? useId();
  const rootProps = {
    ...(invalid !== undefined ? { invalid } : {}),
  };

  return (
    <Field.Root {...rootProps} className={cx('chips-input', className)} data-scope={chipsScope} data-part="root">
      {label ? (
        <Field.Label data-part="label" htmlFor={generatedId}>
          {label}
        </Field.Label>
      ) : null}
      <Field.Input {...props} id={generatedId} data-part="control" />
      {helperText ? <Field.HelperText data-part="helper">{helperText}</Field.HelperText> : null}
      {errorText ? <Field.ErrorText data-part="error">{errorText}</Field.ErrorText> : null}
    </Field.Root>
  );
}
