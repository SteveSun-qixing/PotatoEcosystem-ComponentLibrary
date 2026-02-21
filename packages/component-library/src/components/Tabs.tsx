import { Tabs as ArkTabs } from '@ark-ui/react/tabs';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  chipsScope?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  chipsScope = 'tabs',
}: TabsProps) {
  const rootProps = {
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
  };

  return (
    <ArkTabs.Root
      {...rootProps}
      className={cx('chips-tabs', className)}
      data-scope={chipsScope}
      data-part="root"
      onValueChange={(details) => onValueChange?.(details.value)}
    >
      <ArkTabs.List data-part="list">
        {items.map((item) => (
          <ArkTabs.Trigger key={item.id} value={item.id} data-part="trigger">
            {item.label}
          </ArkTabs.Trigger>
        ))}
        <ArkTabs.Indicator data-part="indicator" />
      </ArkTabs.List>
      {items.map((item) => (
        <ArkTabs.Content key={item.id} value={item.id} data-part="content">
          {item.content}
        </ArkTabs.Content>
      ))}
    </ArkTabs.Root>
  );
}
