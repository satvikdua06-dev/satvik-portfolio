'use client';

import { useEffect, useRef } from 'react';
import { MotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';

type Props = {
  sectionProgress: MotionValue<number>;
  frameCount: number;
  framesPath: string;
  triggerLoad?: boolean;
  onCriticalReady?: (n: number) => void;
  isActive?: boolean;
};

export default function FrameCanvas({
  sectionProgress,
  frameCount,
  framesPath,
  triggerLoad,
  onCriticalReady,
  isActive,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentIndexRef = useRef<number>(0);
  const pendingIndexRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const pollRafRef = useRef<number | null>(null);
  const dprRef = useRef<number>(1);
  const sizeRef = useRef<{ vw: number; vh: number }>({ vw: 0, vh: 0 });
  const gcDoneRef = useRef(false);
  const criticalLoadedRef = useRef(0);
  const prefersReduced = useReducedMotion();

  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const isMobile = window.innerWidth < 768;
    const dpr = isMobile
      ? Math.min(window.devicePixelRatio * 0.5, 1)
      : (window.devicePixelRatio || 1);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    dprRef.current = dpr;
    sizeRef.current = { vw, vh };
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const { vw, vh } = sizeRef.current;
    if (!vw || !vh) return;

    const scale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const offsetX = (vw - drawW) / 2;
    const offsetY = (vh - drawH) / 2;

    ctx.clearRect(0, 0, vw, vh);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    const progress = sectionProgress.get();
    const nearStart = Math.max(0, 1 - progress / 0.03);
    const nearEnd   = Math.max(0, 1 - (1 - progress) / 0.03);
    const flash = Math.max(nearStart, nearEnd);

    if (flash > 0) {
      const cx = vw / 2;
      const cy = vh / 2;
      const radius = Math.max(vw, vh) * 0.4;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(255,255,255,${flash * 0.12})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, vw, vh);
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  // Fix A: check img.complete BEFORE advancing currentIndexRef.
  // If the frame is not yet decoded, retry next rAF tick without locking
  // currentIndexRef — so the next tick will attempt the draw again.
  const scheduleDraw = (index: number) => {
    pendingIndexRef.current = index;
    if (rafIdRef.current !== null) return;

    const tick = () => {
      rafIdRef.current = null;
      if (!canvasRef.current) return; // guard against post-unmount callbacks
      const next = pendingIndexRef.current;
      const img = imagesRef.current[next];
      if (!img || !img.complete || !img.naturalWidth) {
        // Frame not yet decoded — retry without advancing currentIndexRef
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }
      if (next === currentIndexRef.current) return;
      currentIndexRef.current = next;
      drawFrame(next);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  // Fix C: poll loop that resets currentIndexRef while frames are still
  // loading. Ensures any newly decoded frame triggers a redraw on the next
  // scheduleDraw call, even if the user has stopped scrolling.
  const startPendingPoll = () => {
    if (pollRafRef.current !== null) cancelAnimationFrame(pollRafRef.current);
    const check = () => {
      const allLoaded = imagesRef.current.every(
        (img) => img && img.complete && img.naturalWidth > 0
      );
      if (!allLoaded) {
        currentIndexRef.current = -1;
        pollRafRef.current = requestAnimationFrame(check);
      } else {
        pollRafRef.current = null;
      }
    };
    pollRafRef.current = requestAnimationFrame(check);
  };

  const loadFrames = (startIndex: number, endIndex: number) => {
    for (let i = startIndex; i <= endIndex; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${framesPath}/${i + 1}.webp`;
      const capturedI = i;
      const onLoad = () => {
        if (capturedI === 0) drawFrame(0);
        // Fix B: if this is the frame the canvas is currently stuck on,
        // clear the guard so the next scheduleDraw call redraws it.
        const needed = Math.min(
          Math.round(Math.max(0, sectionProgress.get()) * (frameCount - 1)),
          frameCount - 1
        );
        if (capturedI === needed && currentIndexRef.current === capturedI) {
          currentIndexRef.current = -1;
          drawFrame(capturedI);
        }
      };
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad, { once: true });
      }
      imagesRef.current[capturedI] = img;
    }
  };

  // Mount: canvas setup + Section 1 critical-first load (25 frames before background load)
  useEffect(() => {
    sizeCanvas();
    imagesRef.current = new Array(frameCount).fill(null);

    if (triggerLoad === undefined) {
      const CRITICAL_END = Math.min(24, frameCount - 1);
      criticalLoadedRef.current = 0;

      for (let i = 0; i <= CRITICAL_END; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.src = `${framesPath}/${i + 1}.webp`;
        const capturedI = i;
        const onLoad = () => {
          if (capturedI === 0) drawFrame(0);
          const count = ++criticalLoadedRef.current;
          onCriticalReady?.(count);
          // Fix B: unblock if stuck on this critical frame
          const needed = Math.min(
            Math.round(Math.max(0, sectionProgress.get()) * (frameCount - 1)),
            frameCount - 1
          );
          if (capturedI === needed && currentIndexRef.current === capturedI) {
            currentIndexRef.current = -1;
            drawFrame(capturedI);
          }
          if (count === CRITICAL_END + 1) {
            loadFrames(CRITICAL_END + 1, frameCount - 1);
            startPendingPoll(); // Fix C
          }
        };
        if (img.complete && img.naturalWidth > 0) {
          onLoad();
        } else {
          img.addEventListener('load', onLoad, { once: true });
        }
        imagesRef.current[capturedI] = img;
      }
    }

    const handleResize = () => {
      sizeCanvas();
      drawFrame(currentIndexRef.current);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (pollRafRef.current !== null) {
        cancelAnimationFrame(pollRafRef.current);
        pollRafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, framesPath]);

  // Gated load for Sections 2 & 3 — fires when parent signals readiness
  useEffect(() => {
    if (triggerLoad === undefined || !triggerLoad) return;
    loadFrames(0, frameCount - 1);
    startPendingPoll(); // Fix C
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerLoad, frameCount, framesPath]);

  // GC fires on scroll — checks isActive at the moment progress exceeds threshold
  useMotionValueEvent(sectionProgress, 'change', (v) => {
    if (!isActive && v > 0.99 && !gcDoneRef.current) {
      imagesRef.current.forEach((img) => {
        if (img) img.src = '';
      });
      imagesRef.current = imagesRef.current.map(() => null);
      gcDoneRef.current = true;
    }
  });

  // Re-hydrate from browser cache when section becomes active again
  useEffect(() => {
    if (isActive && gcDoneRef.current) {
      loadFrames(0, frameCount - 1);
      gcDoneRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useMotionValueEvent(sectionProgress, 'change', (v) => {
    if (prefersReduced) return;
    const index = Math.min(
      Math.round(Math.max(0, v) * (frameCount - 1)),
      frameCount - 1
    );
    if (index !== currentIndexRef.current) {
      scheduleDraw(index);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
