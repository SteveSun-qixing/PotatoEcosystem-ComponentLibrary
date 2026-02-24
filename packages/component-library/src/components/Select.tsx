import { chipsCreateListCollection } from '@chips/ui-primitives-react/collection';
import { ChipsSelectPrimitive } from '@chips/ui-primitives-react/select';
import { useMemo } from 'react';
import { cx } from '../utils/cx';

export interface ChipsSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ChipsSelectProps {
  label?: string;
  placeholder?: string;
  options: ChipsSelectOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string | undefined) => void;
  className?: string;
  chipsScope?: string;
}

export function ChipsSelect({
  label,
  placeholder,
  options,
  value,
  defaultValue,
  disabled,
  onValueChange,
  className,
  chipsScope = 'chips-select',
}: ChipsSelectProps) {
  const collection = useMemo(
    () =>
      chipsCreateListCollection<ChipsSelectOption>({
        items: options,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
      }),
    [options],
  );

  const rootProps = {
    collection,
    ...(value !== undefined ? { value: [value] } : {}),
    ...(defaultValue !== undefined ? { defaultValue: [defaultValue] } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
  };

  return (
    <ChipsSelectPrimitive.Root
      {...rootProps}
      className={cx('chips-select', disabled ? 'chips-select--disabled' : null, className)}
      data-scope={chipsScope}
      data-part="root"
      onValueChange={(details) => onValueChange?.(details.value[0])}
    >
      {label ? (
        <ChipsSelectPrimitive.Label className="chips-select__label" data-part="label">
          {label}
        </ChipsSelectPrimitive.Label>
      ) : null}
      <ChipsSelectPrimitive.Control className="chips-select__control" data-part="control">
        <ChipsSelectPrimitive.Trigger className="chips-select__trigger" data-part="trigger">
          {placeholder ? (
            <ChipsSelectPrimitive.ValueText className="chips-select__value" data-part="value" placeholder={placeholder} />
          ) : (
            <ChipsSelectPrimitive.ValueText className="chips-select__value" data-part="value" />
          )}
        </ChipsSelectPrimitive.Trigger>
        <ChipsSelectPrimitive.Indicator className="chips-select__icon" data-part="indicator">
          ▾
        </ChipsSelectPrimitive.Indicator>
      </ChipsSelectPrimitive.Control>
      <ChipsSelectPrimitive.HiddenSelect />
      <ChipsSelectPrimitive.Positioner>
        <ChipsSelectPrimitive.Content className="chips-select__panel" data-part="content">
          <ChipsSelectPrimitive.List>
            {collection.items.map((item) => (
              <ChipsSelectPrimitive.Item className="chips-select__option" key={item.value} item={item} data-part="item">
                <ChipsSelectPrimitive.ItemText>{item.label}</ChipsSelectPrimitive.ItemText>
                <ChipsSelectPrimitive.ItemIndicator>✓</ChipsSelectPrimitive.ItemIndicator>
              </ChipsSelectPrimitive.Item>
            ))}
          </ChipsSelectPrimitive.List>
        </ChipsSelectPrimitive.Content>
      </ChipsSelectPrimitive.Positioner>
    </ChipsSelectPrimitive.Root>
  );
}
