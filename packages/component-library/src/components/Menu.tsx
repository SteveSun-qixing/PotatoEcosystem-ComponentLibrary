import { Menu as ArkMenu } from '@ark-ui/react/menu';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface MenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  onSelect?: (id: string) => void;
  className?: string;
  chipsScope?: string;
}

export function Menu({ trigger, items, onSelect, className, chipsScope = 'menu' }: MenuProps) {
  return (
    <ArkMenu.Root>
      <ArkMenu.Trigger data-scope={chipsScope} data-part="trigger">
        {trigger}
      </ArkMenu.Trigger>
      <ArkMenu.Positioner>
        <ArkMenu.Content className={cx('chips-menu', className)} data-scope={chipsScope} data-part="content">
          {items.map((item) => (
            <ArkMenu.Item
              key={item.id}
              value={item.id}
              disabled={item.disabled}
              data-part="item"
              onSelect={() => onSelect?.(item.id)}
            >
              <span data-part="item-text">{item.label}</span>
            </ArkMenu.Item>
          ))}
        </ArkMenu.Content>
      </ArkMenu.Positioner>
    </ArkMenu.Root>
  );
}
