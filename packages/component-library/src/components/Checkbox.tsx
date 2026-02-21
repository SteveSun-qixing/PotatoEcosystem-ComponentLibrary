import { Checkbox as ArkCheckbox } from '@ark-ui/react/checkbox';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
  className?: string;
}

export function Checkbox({
  checked,
  defaultChecked,
  disabled,
  name,
  value,
  onCheckedChange,
  children,
  className,
}: CheckboxProps) {
  const rootProps = {
    ...(checked !== undefined ? { checked } : {}),
    ...(defaultChecked !== undefined ? { defaultChecked } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(value !== undefined ? { value } : {}),
  };

  return (
    <ArkCheckbox.Root
      {...rootProps}
      onCheckedChange={(details) => onCheckedChange?.(details.checked === true)}
      className={cx('chips-checkbox', className)}
      data-scope="checkbox"
      data-part="root"
    >
      <ArkCheckbox.HiddenInput />
      <ArkCheckbox.Control data-part="control">
        <ArkCheckbox.Indicator data-part="indicator">✓</ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      <ArkCheckbox.Label data-part="label">{children}</ArkCheckbox.Label>
    </ArkCheckbox.Root>
  );
}
