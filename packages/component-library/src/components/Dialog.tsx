import { ChipsDialogPrimitive } from '@chips/ui-primitives-react/dialog';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface ChipsDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
  chipsScope?: string;
}

export function ChipsDialog({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  className,
  chipsScope = 'chips-dialog',
}: ChipsDialogProps) {
  const rootProps = {
    ...(open !== undefined ? { open } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
  };

  return (
    <ChipsDialogPrimitive.Root {...rootProps} onOpenChange={(details) => onOpenChange?.(details.open)}>
      {trigger ? <ChipsDialogPrimitive.Trigger>{trigger}</ChipsDialogPrimitive.Trigger> : null}
      <ChipsDialogPrimitive.Positioner>
        <ChipsDialogPrimitive.Backdrop data-scope={chipsScope} data-part="backdrop" />
        <ChipsDialogPrimitive.Content className={cx('chips-dialog', className)} data-scope={chipsScope} data-part="content">
          {title ? <ChipsDialogPrimitive.Title data-part="title">{title}</ChipsDialogPrimitive.Title> : null}
          {description ? <ChipsDialogPrimitive.Description data-part="description">{description}</ChipsDialogPrimitive.Description> : null}
          <div data-part="body">{children}</div>
          <ChipsDialogPrimitive.CloseTrigger data-part="close">Close</ChipsDialogPrimitive.CloseTrigger>
        </ChipsDialogPrimitive.Content>
      </ChipsDialogPrimitive.Positioner>
    </ChipsDialogPrimitive.Root>
  );
}
