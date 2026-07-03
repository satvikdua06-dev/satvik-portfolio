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

  const scheduleDraw = (index: number) => {
    pendingIndexRef.current = index;
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const next = pendingIndexRef.current;
      if (next !== currentIndexRef.current) {
        currentIndexRef.current = next;
        drawFrame(next);
      }
    });
  };

  const loadFrames = (startIndex: number, endIndex: number) => {
    for (let i = startIndex; i <= endIndex; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${framesPath}/${i + 1}.webp`;
      const capturedI = i;
      const onLoad = () => {
        if (capturedI === 0) drawFrame(0);
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
          if (count === CRITICAL_END + 1) {
            loadFrames(CRITICAL_END + 1, frameCount - 1);
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, framesPath]);

  // Gated load for Sections 2 & 3 — fires when parent signals readiness
  useEffect(() => {
    if (triggerLoad === undefined || !triggerLoad) return;
    loadFrames(0, frameCount - 1);
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
