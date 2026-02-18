import { createListCollection } from '@ark-ui/react/collection';
import { Select as ArkSelect } from '@ark-ui/react/select';
import { useMemo } from 'react';
import { cx } from '../utils/cx';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string | undefined) => void;
  className?: string;
  chipsScope?: string;
}

export function Select({
  label,
  placeholder,
  options,
  value,
  defaultValue,
  disabled,
  onValueChange,
  className,
  chipsScope = 'select',
}: SelectProps) {
  const collection = useMemo(
    () =>
      createListCollection<SelectOption>({
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
    <ArkSelect.Root
      {...rootProps}
      className={cx('chips-select', className)}
      data-scope={chipsScope}
      onValueChange={(details) => onValueChange?.(details.value[0])}
    >
      {label ? <ArkSelect.Label data-part="label">{label}</ArkSelect.Label> : null}
      <ArkSelect.Control data-part="control">
        <ArkSelect.Trigger data-part="trigger">
          {placeholder ? <ArkSelect.ValueText placeholder={placeholder} /> : <ArkSelect.ValueText />}
        </ArkSelect.Trigger>
        <ArkSelect.Indicator data-part="indicator">▾</ArkSelect.Indicator>
      </ArkSelect.Control>
      <ArkSelect.HiddenSelect />
      <ArkSelect.Positioner>
        <ArkSelect.Content data-part="content">
          <ArkSelect.List>
            {collection.items.map((item) => (
              <ArkSelect.Item key={item.value} item={item} data-part="item">
                <ArkSelect.ItemText>{item.label}</ArkSelect.ItemText>
                <ArkSelect.ItemIndicator>✓</ArkSelect.ItemIndicator>
              </ArkSelect.Item>
            ))}
          </ArkSelect.List>
        </ArkSelect.Content>
      </ArkSelect.Positioner>
    </ArkSelect.Root>
  );
}
