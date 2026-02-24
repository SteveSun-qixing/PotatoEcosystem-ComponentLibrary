import { ChipsSwitchPrimitive } from '@chips/ui-primitives-react/switch';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface ChipsSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
  className?: string;
  chipsScope?: string;
}

export function ChipsSwitch({
  checked,
  defaultChecked,
  disabled,
  name,
  onCheckedChange,
  children,
  className,
  chipsScope = 'chips-switch',
}: ChipsSwitchProps) {
  const rootProps = {
    ...(checked !== undefined ? { checked } : {}),
    ...(defaultChecked !== undefined ? { defaultChecked } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(name !== undefined ? { name } : {}),
  };

  return (
    <ChipsSwitchPrimitive.Root
      {...rootProps}
      className={cx('chips-switch', className)}
      data-scope={chipsScope}
      data-part="root"
      onCheckedChange={(details) => onCheckedChange?.(details.checked === true)}
    >
      <ChipsSwitchPrimitive.HiddenInput />
      <ChipsSwitchPrimitive.Control data-part="control">
        <ChipsSwitchPrimitive.Thumb data-part="thumb" />
      </ChipsSwitchPrimitive.Control>
      {children ? <ChipsSwitchPrimitive.Label data-part="label">{children}</ChipsSwitchPrimitive.Label> : null}
    </ChipsSwitchPrimitive.Root>
  );
}
