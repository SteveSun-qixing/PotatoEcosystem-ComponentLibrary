import type { ButtonHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { useThemeTokens } from '../theme/useThemeTokens';

type DivProps = HTMLAttributes<HTMLDivElement>;

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;

type CloseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>;

export interface ImageViewerShellProps {
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

const THEME_KEYS = [
  'sys-color-surface-overlay',
  'sys-color-text-inverse',
  'sys-color-border-subtle',
  'sys-radius-pill',
  'sys-space-5',
  'sys-space-6',
  'sys-z-popover',
  'sys-elevation-3',
  'sys-motion-duration-normal',
  'sys-motion-easing-standard',
];

export function ImageViewerShell({
  src,
  alt = '',
  chipsScope = 'image-viewer-shell',
  className,
  closeLabel = 'Close',
  onClose,
  overlayProps,
  stageProps,
  imageProps,
  closeButtonProps,
}: ImageViewerShellProps) {
  const tokens = useThemeTokens(THEME_KEYS);

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
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tokens['sys-color-surface-overlay'] ?? 'rgba(10, 15, 25, 0.36)',
        backdropFilter: 'blur(18px) saturate(145%)',
        WebkitBackdropFilter: 'blur(18px) saturate(145%)',
        zIndex: Number(tokens['sys-z-popover'] ?? 1200),
        transition: `opacity ${tokens['sys-motion-duration-normal'] ?? '180ms'} ${tokens['sys-motion-easing-standard'] ?? 'cubic-bezier(0.2, 0, 0, 1)'}`,
        ...overlayProps?.style,
      }}
    >
      <div
        {...stageProps}
        className={stageClassName}
        data-scope={chipsScope}
        data-part="stage"
        style={{
          position: 'relative',
          width: 'min(96vw, 1600px)',
          height: '92vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: tokens['sys-elevation-3'] ?? '0 16px 32px rgba(0, 0, 0, 0.22)',
          ...stageProps?.style,
        }}
      >
        <img
          {...imageProps}
          src={src}
          alt={alt}
          className={imageClassName}
          data-scope={chipsScope}
          data-part="image"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            userSelect: 'none',
            ...imageProps?.style,
          }}
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
        style={{
          position: 'absolute',
          top: tokens['sys-space-5'] ?? '20px',
          right: tokens['sys-space-6'] ?? '24px',
          width: '36px',
          height: '36px',
          border: `1px solid ${tokens['sys-color-border-subtle'] ?? 'rgba(255, 255, 255, 0.4)'}`,
          borderRadius: tokens['sys-radius-pill'] ?? '999px',
          background: 'rgba(22, 30, 42, 0.55)',
          color: tokens['sys-color-text-inverse'] ?? '#ffffff',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 600,
          ...closeButtonProps?.style,
        }}
        aria-label={closeButtonProps?.['aria-label'] ?? closeLabel}
      >
        x
      </button>
      {overlayProps?.children}
    </div>
  );
}
