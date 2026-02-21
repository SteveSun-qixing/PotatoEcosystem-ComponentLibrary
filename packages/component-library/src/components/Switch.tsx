import { Switch as ArkSwitch } from '@ark-ui/react/switch';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
  className?: string;
  chipsScope?: string;
}

export function Switch({
  checked,
  defaultChecked,
  disabled,
  name,
  onCheckedChange,
  children,
  className,
  chipsScope = 'switch',
}: SwitchProps) {
  const rootProps = {
    ...(checked !== undefined ? { checked } : {}),
    ...(defaultChecked !== undefined ? { defaultChecked } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(name !== undefined ? { name } : {}),
  };

  return (
    <ArkSwitch.Root
      {...rootProps}
      className={cx('chips-switch', className)}
      data-scope={chipsScope}
      data-part="root"
      onCheckedChange={(details) => onCheckedChange?.(details.checked === true)}
    >
      <ArkSwitch.HiddenInput />
      <ArkSwitch.Control data-part="control">
        <ArkSwitch.Thumb data-part="thumb" />
      </ArkSwitch.Control>
      {children ? <ArkSwitch.Label data-part="label">{children}</ArkSwitch.Label> : null}
    </ArkSwitch.Root>
  );
}
