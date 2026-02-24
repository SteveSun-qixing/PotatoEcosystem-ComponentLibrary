import type { ButtonHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

type DivProps = HTMLAttributes<HTMLDivElement>;

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;

type CloseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>;

export interface ChipsImageViewerShellProps {
  src: string;
  alt?: string;
  chipsScope?: string;
  className?: string;
  closeLabel?: string;
  onClose?: () => void;
  overlayProps?: DivProps;
  stageProps?: DivProps;
  imageProps?: ImageProps;
  closeButtonProps?: CloseButtonProps;
}

export function ChipsImageViewerShell({
  src,
  alt = '',
  chipsScope = 'chips-image-viewer-shell',
  className,
  closeLabel = 'Close',
  onClose,
  overlayProps,
  stageProps,
  imageProps,
  closeButtonProps,
}: ChipsImageViewerShellProps) {
  const overlayClassName = cx('chips-image-viewer-shell', className, overlayProps?.className);
  const stageClassName = cx('chips-image-viewer-shell-stage', stageProps?.className);
  const imageClassName = cx('chips-image-viewer-shell-image', imageProps?.className);
  const closeClassName = cx('chips-image-viewer-shell-close', closeButtonProps?.className);

  const handleCloseClick = (): void => {
    onClose?.();
  };

  return (
    <div
      {...overlayProps}
      className={overlayClassName}
      data-scope={chipsScope}
      data-part="overlay"
      style={overlayProps?.style}
    >
      <div
        {...stageProps}
        className={stageClassName}
        data-scope={chipsScope}
        data-part="stage"
        style={stageProps?.style}
      >
        <img
          {...imageProps}
          src={src}
          alt={alt}
          className={imageClassName}
          data-scope={chipsScope}
          data-part="image"
          style={imageProps?.style}
          draggable={false}
        />
        {stageProps?.children}
      </div>
      <button
        {...closeButtonProps}
        type="button"
        className={closeClassName}
        data-scope={chipsScope}
        data-part="close"
        onClick={handleCloseClick}
        style={closeButtonProps?.style}
        aria-label={closeButtonProps?.['aria-label'] ?? closeLabel}
      >
        x
      </button>
      {overlayProps?.children}
    </div>
  );
}
