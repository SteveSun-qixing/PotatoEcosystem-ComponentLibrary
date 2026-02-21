import { RadioGroup as ArkRadioGroup } from '@ark-ui/react/radio-group';
import { cx } from '../utils/cx';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  chipsScope?: string;
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  disabled,
  name,
  onValueChange,
  className,
  chipsScope = 'radio-group',
}: RadioGroupProps) {
  const rootProps = {
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(name !== undefined ? { name } : {}),
  };

  return (
    <ArkRadioGroup.Root
      {...rootProps}
      className={cx('chips-radio-group', className)}
      data-scope={chipsScope}
      data-part="root"
      onValueChange={(details) => onValueChange?.(details.value)}
    >
      {options.map((item) => (
        <ArkRadioGroup.Item key={item.value} value={item.value} disabled={item.disabled} data-part="item">
          <ArkRadioGroup.ItemHiddenInput />
          <ArkRadioGroup.ItemControl data-part="control">
            <ArkRadioGroup.Indicator data-part="indicator" />
          </ArkRadioGroup.ItemControl>
          <ArkRadioGroup.ItemText data-part="label">{item.label}</ArkRadioGroup.ItemText>
        </ArkRadioGroup.Item>
      ))}
    </ArkRadioGroup.Root>
  );
}
