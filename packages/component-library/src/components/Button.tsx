import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface ChipsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  chipsScope?: string;
}

export function ChipsButton({ chipsScope = 'chips-button', className, type = 'button', ...props }: ChipsButtonProps) {
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
