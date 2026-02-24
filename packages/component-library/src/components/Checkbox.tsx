import { ChipsCheckboxPrimitive } from '@chips/ui-primitives-react/checkbox';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface ChipsCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
  className?: string;
}

export function ChipsCheckbox({
  checked,
  defaultChecked,
  disabled,
  name,
  value,
  onCheckedChange,
  children,
  className,
}: ChipsCheckboxProps) {
  const rootProps = {
    ...(checked !== undefined ? { checked } : {}),
    ...(defaultChecked !== undefined ? { defaultChecked } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(value !== undefined ? { value } : {}),
  };

  return (
    <ChipsCheckboxPrimitive.Root
      {...rootProps}
      onCheckedChange={(details) => onCheckedChange?.(details.checked === true)}
      className={cx('chips-checkbox', className)}
      data-scope="chips-checkbox"
      data-part="root"
    >
      <ChipsCheckboxPrimitive.HiddenInput />
      <ChipsCheckboxPrimitive.Control data-part="control">
        <ChipsCheckboxPrimitive.Indicator data-part="indicator">✓</ChipsCheckboxPrimitive.Indicator>
      </ChipsCheckboxPrimitive.Control>
      <ChipsCheckboxPrimitive.Label data-part="label">{children}</ChipsCheckboxPrimitive.Label>
    </ChipsCheckboxPrimitive.Root>
  );
}
