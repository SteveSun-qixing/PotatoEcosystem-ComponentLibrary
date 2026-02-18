import type { FormHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  chipsScope?: string;
}

export function Form({ children, className, chipsScope = 'form', ...props }: FormProps) {
  return (
    <form {...props} className={cx('chips-form', className)} data-scope={chipsScope} data-part="root">
      {children}
    </form>
  );
}
