import type { FormHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface ChipsFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  chipsScope?: string;
}

export function ChipsForm({ children, className, chipsScope = 'chips-form', ...props }: ChipsFormProps) {
  return (
    <form {...props} className={cx('chips-form', className)} data-scope={chipsScope} data-part="root">
      {children}
    </form>
  );
}
