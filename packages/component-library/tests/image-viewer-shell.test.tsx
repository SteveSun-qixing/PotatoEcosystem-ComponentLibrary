import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImageViewerShell } from '../src/components/ImageViewerShell';

describe('ImageViewerShell', () => {
  it('renders shell with scoped parts and contract class names', () => {
    render(
      <ImageViewerShell src="https://example.com/demo.png" alt="demo image" chipsScope="image-viewer-shell" />
    );

    const overlay = document.querySelector('[data-part="overlay"]') as HTMLElement | null;
    if (!overlay) {
      throw new Error('Overlay not found');
    }

    expect(overlay.getAttribute('data-scope')).toBe('image-viewer-shell');
    expect(overlay.className.includes('chips-image-viewer-shell')).toBe(true);
    expect(document.querySelector('[data-part="stage"]')?.className.includes('chips-image-viewer-shell-stage')).toBe(
      true
    );
    expect(document.querySelector('[data-part="image"]')?.className.includes('chips-image-viewer-shell-image')).toBe(
      true
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton.className.includes('chips-image-viewer-shell-close')).toBe(true);
  });

  it('triggers onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(<ImageViewerShell src="https://example.com/demo.png" onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('supports slot-level prop composition', () => {
    render(
      <ImageViewerShell
        src="https://example.com/demo.png"
        alt="composed image"
        overlayProps={{ className: 'overlay-extra', id: 'overlay-shell' }}
        stageProps={{ className: 'stage-extra' }}
        imageProps={{ className: 'image-extra', loading: 'lazy' }}
      />
    );

    const overlay = document.getElementById('overlay-shell');
    const stage = document.querySelector('[data-part="stage"]');
    const image = document.querySelector('[data-part="image"]') as HTMLImageElement | null;

    expect(overlay?.className.includes('overlay-extra')).toBe(true);
    expect(stage?.className.includes('stage-extra')).toBe(true);
    expect(image?.className.includes('image-extra')).toBe(true);
    expect(image?.getAttribute('loading')).toBe('lazy');
  });
});
