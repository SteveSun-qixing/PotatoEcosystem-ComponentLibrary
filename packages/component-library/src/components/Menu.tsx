import { ChipsMenuPrimitive } from '@chips/ui-primitives-react/menu';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface ChipsMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ChipsMenuProps {
  trigger: ReactNode;
  items: ChipsMenuItem[];
  onSelect?: (id: string) => void;
  className?: string;
  chipsScope?: string;
}

export function ChipsMenu({ trigger, items, onSelect, className, chipsScope = 'chips-menu' }: ChipsMenuProps) {
  return (
    <ChipsMenuPrimitive.Root>
      <ChipsMenuPrimitive.Trigger data-scope={chipsScope} data-part="trigger">
        {trigger}
      </ChipsMenuPrimitive.Trigger>
      <ChipsMenuPrimitive.Positioner>
        <ChipsMenuPrimitive.Content className={cx('chips-menu', className)} data-scope={chipsScope} data-part="content">
          {items.map((item) => (
            <ChipsMenuPrimitive.Item
              key={item.id}
              value={item.id}
              disabled={item.disabled}
              data-part="item"
              onSelect={() => onSelect?.(item.id)}
            >
              <span data-part="item-text">{item.label}</span>
            </ChipsMenuPrimitive.Item>
          ))}
        </ChipsMenuPrimitive.Content>
      </ChipsMenuPrimitive.Positioner>
    </ChipsMenuPrimitive.Root>
  );
}
