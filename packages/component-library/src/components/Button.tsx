import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  chipsScope?: string;
}

export function Button({ chipsScope = 'button', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-scope={chipsScope}
      data-part="root"
      className={cx('chips-button', className)}
      {...props}
    />
  );
}
