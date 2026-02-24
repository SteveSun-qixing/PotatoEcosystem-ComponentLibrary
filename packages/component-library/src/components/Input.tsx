import { ChipsFieldPrimitive } from '@chips/ui-primitives-react/field';
import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface ChipsInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  invalid?: boolean;
  chipsScope?: string;
}

export function ChipsInput({
  label,
  helperText,
  errorText,
  invalid,
  chipsScope = 'chips-input',
  className,
  id,
  ...props
}: ChipsInputProps) {
  const generatedId = id ?? useId();
  const rootProps = {
    ...(invalid !== undefined ? { invalid } : {}),
  };

  return (
    <ChipsFieldPrimitive.Root {...rootProps} className={cx('chips-input', className)} data-scope={chipsScope} data-part="root">
      {label ? (
        <ChipsFieldPrimitive.Label data-part="label" htmlFor={generatedId}>
          {label}
        </ChipsFieldPrimitive.Label>
      ) : null}
      <ChipsFieldPrimitive.Input {...props} id={generatedId} data-part="control" />
      {helperText ? <ChipsFieldPrimitive.HelperText data-part="helper">{helperText}</ChipsFieldPrimitive.HelperText> : null}
      {errorText ? <ChipsFieldPrimitive.ErrorText data-part="error">{errorText}</ChipsFieldPrimitive.ErrorText> : null}
    </ChipsFieldPrimitive.Root>
  );
}
