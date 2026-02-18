import { Dialog as ArkDialog } from '@ark-ui/react/dialog';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface DialogProps {
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

export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  className,
  chipsScope = 'dialog',
}: DialogProps) {
  const rootProps = {
    ...(open !== undefined ? { open } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
  };

  return (
    <ArkDialog.Root {...rootProps} onOpenChange={(details) => onOpenChange?.(details.open)}>
      {trigger ? <ArkDialog.Trigger>{trigger}</ArkDialog.Trigger> : null}
      <ArkDialog.Positioner>
        <ArkDialog.Backdrop data-scope={chipsScope} data-part="backdrop" />
        <ArkDialog.Content className={cx('chips-dialog', className)} data-scope={chipsScope} data-part="content">
          {title ? <ArkDialog.Title data-part="title">{title}</ArkDialog.Title> : null}
          {description ? <ArkDialog.Description data-part="description">{description}</ArkDialog.Description> : null}
          <div data-part="body">{children}</div>
          <ArkDialog.CloseTrigger data-part="close">Close</ArkDialog.CloseTrigger>
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </ArkDialog.Root>
  );
}
