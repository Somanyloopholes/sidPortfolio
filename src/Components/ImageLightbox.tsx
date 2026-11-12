import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

export interface LightboxImage {
  src: string;
  alt: string;
  caption: string | null;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  /** Index of the open image, or null when the lightbox is closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

// Rendered into <body> so `position: fixed` isn't affected by transformed ancestors (the page transition).
export default function ImageLightbox({ images, index, onIndexChange, onClose }: ImageLightboxProps) {
  return createPortal(
    <AnimatePresence>
      {index !== null && index < images.length && (
        <LightboxView key="lightbox" images={images} index={index} onIndexChange={onIndexChange} onClose={onClose} />
      )}
    </AnimatePresence>,
    document.body
  );
}

interface LightboxViewProps extends Omit<ImageLightboxProps, 'index'> {
  index: number;
}

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

const controlButtonClass =
  "p-2 bg-primary-background border border-hero-accent text-hero-accent hover:bg-hero-accent hover:text-primary-background transition-colors relative after:absolute after:-inset-1.5 after:content-['']";

function LightboxView({ images, index, onIndexChange, onClose }: LightboxViewProps) {
  const image = images[index];
  const hasMany = images.length > 1;

  // Zoomed shows the image at its full resolution inside a scrollable area.
  const [zoomed, setZoomed] = useState(false);
  const [canZoom, setCanZoom] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  // Where to center the scroll after zooming in, as a fraction of the image size.
  const zoomPointRef = useRef<{ x: number; y: number } | null>(null);
  // Set while a swipe is in progress, so the click that ends it doesn't toggle zoom.
  const draggedRef = useRef(false);

  // Captured during the first render, before autoFocus moves focus into the lightbox.
  const [returnFocusTo] = useState(() =>
    document.activeElement instanceof HTMLElement ? document.activeElement : null
  );

  useEffect(() => {
    return () => returnFocusTo?.focus({ preventScroll: true });
  }, [returnFocusTo]);

  const showImage = (nextIndex: number) => {
    setZoomed(false);
    setCanZoom(false);
    onIndexChange((nextIndex + images.length) % images.length);
  };

  // Capture phase on window runs before the project modal's Escape handler, so Escape closes only the lightbox.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
        return;
      }
      // While zoomed, the arrow keys scroll the image instead.
      if (!hasMany || zoomed) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setZoomed(false);
        setCanZoom(false);
        const step = e.key === 'ArrowRight' ? 1 : -1;
        onIndexChange((index + step + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [hasMany, zoomed, index, images.length, onIndexChange, onClose]);

  // Zooming is only offered when the image has more pixels than the space it's fitted into.
  const updateCanZoom = () => {
    const img = imageRef.current;
    if (!img || zoomed) return;
    setCanZoom(img.naturalWidth > img.clientWidth + 1 || img.naturalHeight > img.clientHeight + 1);
  };

  useEffect(() => {
    window.addEventListener('resize', updateCanZoom);
    return () => window.removeEventListener('resize', updateCanZoom);
  });

  const toggleZoom = (point = { x: 0.5, y: 0.5 }) => {
    if (zoomed) {
      setZoomed(false);
      return;
    }
    if (!canZoom) return;
    zoomPointRef.current = point;
    setZoomed(true);
  };

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const point = zoomPointRef.current;
    if (!zoomed || !scroller || !point) return;
    zoomPointRef.current = null;
    scroller.scrollLeft = point.x * scroller.scrollWidth - scroller.clientWidth / 2;
    scroller.scrollTop = point.y * scroller.scrollHeight - scroller.clientHeight / 2;
  }, [zoomed]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    toggleZoom({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) showImage(index + 1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) showImage(index - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[80] flex flex-col gap-3 p-4 md:p-8 bg-primary-background/95"
    >
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
        <p className="text-micro-tag text-tertiary-text" aria-live="polite">
          {hasMany ? `Image ${index + 1} of ${images.length}` : ''}
        </p>
        <div className="flex items-center gap-3">
          {hasMany && (
            <>
              <button type="button" onClick={() => showImage(index - 1)} aria-label="Previous image" className={controlButtonClass}>
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={() => showImage(index + 1)} aria-label="Next image" className={controlButtonClass}>
                <ChevronRight size={20} />
              </button>
            </>
          )}
          {(canZoom || zoomed) && (
            <button
              type="button"
              onClick={() => toggleZoom()}
              aria-label={zoomed ? 'Fit image to screen' : 'Show image at full size'}
              aria-pressed={zoomed}
              className={controlButtonClass}
            >
              {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="Close image" autoFocus className={controlButtonClass}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Image area: clicking the empty space around the image closes the lightbox */}
      <div
        ref={scrollerRef}
        className={`relative flex-1 min-h-0 w-full flex [justify-content:safe_center] [align-items:safe_center] ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
      >
        <motion.img
          key={image.src}
          ref={imageRef}
          src={image.src}
          alt={image.alt}
          draggable={false}
          onLoad={updateCanZoom}
          onClick={handleImageClick}
          onPointerDown={() => { draggedRef.current = false; }}
          drag={hasMany && !zoomed ? 'x' : false}
          dragSnapToOrigin
          dragElastic={0.4}
          onDragStart={() => { draggedRef.current = true; }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          // Keep vertical scrolling and pinch-zoom on touch screens while the image is swipeable.
          style={{ touchAction: 'pan-y pinch-zoom' }}
          className={`block shrink-0 border border-hero-accent bg-primary-background select-none ${
            zoomed
              ? 'max-w-none max-h-none cursor-zoom-out'
              : `max-w-full max-h-full object-contain ${canZoom ? 'cursor-zoom-in' : 'cursor-default'}`
          }`}
        />
      </div>

      {image.caption && (
        <p className="text-micro-tag text-tertiary-text text-center w-full max-w-[54ch] mx-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          {image.caption}
        </p>
      )}
    </motion.div>
  );
}
