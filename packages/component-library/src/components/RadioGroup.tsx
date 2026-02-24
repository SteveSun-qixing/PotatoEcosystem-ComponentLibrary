import { ChipsRadioGroupPrimitive } from '@chips/ui-primitives-react/radio-group';
import { cx } from '../utils/cx';

export interface ChipsRadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ChipsRadioGroupProps {
  options: ChipsRadioOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onValueChange?: (value: string | undefined) => void;
  className?: string;
  chipsScope?: string;
}

export function ChipsRadioGroup({
  options,
  value,
  defaultValue,
  disabled,
  name,
  onValueChange,
  className,
  chipsScope = 'chips-radio-group',
}: ChipsRadioGroupProps) {
  const rootProps = {
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(name !== undefined ? { name } : {}),
  };

  return (
    <ChipsRadioGroupPrimitive.Root
      {...rootProps}
      className={cx('chips-radio-group', className)}
      data-scope={chipsScope}
      data-part="root"
      onValueChange={(details) => onValueChange?.(details.value ?? undefined)}
    >
      {options.map((item) => (
        <ChipsRadioGroupPrimitive.Item key={item.value} value={item.value} disabled={item.disabled} data-part="item">
          <ChipsRadioGroupPrimitive.ItemHiddenInput />
          <ChipsRadioGroupPrimitive.ItemControl data-part="control">
            <ChipsRadioGroupPrimitive.Indicator data-part="indicator" />
          </ChipsRadioGroupPrimitive.ItemControl>
          <ChipsRadioGroupPrimitive.ItemText data-part="label">{item.label}</ChipsRadioGroupPrimitive.ItemText>
        </ChipsRadioGroupPrimitive.Item>
      ))}
    </ChipsRadioGroupPrimitive.Root>
  );
}
