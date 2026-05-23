'use client';

import { useEffect, useRef } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';

type Props = {
  sectionProgress: MotionValue<number>;
  frameCount: number;
  framesPath: string;
};

export default function FrameCanvas({ sectionProgress, frameCount, framesPath }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIndexRef = useRef<number>(0);
  const pendingIndexRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const dprRef = useRef<number>(1);
  const sizeRef = useRef<{ vw: number; vh: number }>({ vw: 0, vh: 0 });

  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
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

  useEffect(() => {
    sizeCanvas();

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${framesPath}/${i + 1}.webp`;
      const onLoad = () => {
        loadedCount++;
        if (i === 0) drawFrame(0);
      };
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad, { once: true });
      }
      images.push(img);
    }
    imagesRef.current = images;

    if (images[0] && images[0].complete && images[0].naturalWidth > 0) {
      drawFrame(0);
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

  useMotionValueEvent(sectionProgress, 'change', (v) => {
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
