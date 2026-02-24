import { ChipsTabsPrimitive } from '@chips/ui-primitives-react/tabs';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface ChipsTabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface ChipsTabsProps {
  items: ChipsTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  chipsScope?: string;
}

export function ChipsTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  chipsScope = 'chips-tabs',
}: ChipsTabsProps) {
  const rootProps = {
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
  };

  return (
    <ChipsTabsPrimitive.Root
      {...rootProps}
      className={cx('chips-tabs', className)}
      data-scope={chipsScope}
      data-part="root"
      onValueChange={(details) => onValueChange?.(details.value)}
    >
      <ChipsTabsPrimitive.List data-part="list">
        {items.map((item) => (
          <ChipsTabsPrimitive.Trigger key={item.id} value={item.id} data-part="trigger">
            {item.label}
          </ChipsTabsPrimitive.Trigger>
        ))}
        <ChipsTabsPrimitive.Indicator data-part="indicator" />
      </ChipsTabsPrimitive.List>
      {items.map((item) => (
        <ChipsTabsPrimitive.Content key={item.id} value={item.id} data-part="content">
          {item.content}
        </ChipsTabsPrimitive.Content>
      ))}
    </ChipsTabsPrimitive.Root>
  );
}
