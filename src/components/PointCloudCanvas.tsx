"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface PointCloudCanvasProps {
  imageSrc?: string; // Path to the user's image (e.g., "/portrait.png")
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  density: number;
}

export default function PointCloudCanvas({ imageSrc = "/portrait.jpeg" }: PointCloudCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, radius: 45 };

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Initializer function
    const init = () => {
      particles = [];
      const width = canvas.width;
      const height = canvas.height;

      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImageLoaded(true);
        // Draw image offscreen to sample pixels
        const sampleWidth = 140;
        const sampleHeight = 140 * (img.height / img.width);
        
        const offscreen = document.createElement("canvas");
        offscreen.width = sampleWidth;
        offscreen.height = sampleHeight;
        const octx = offscreen.getContext("2d");
        if (!octx) return;

        octx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
        const imgData = octx.getImageData(0, 0, sampleWidth, sampleHeight).data;

        // Position image in the right half of the screen on desktop, centered on mobile
        const isMobile = width < 768;
        const startX = isMobile ? (width - sampleWidth * 4) / 2 : width * 0.55;
        const startY = (height - sampleHeight * 4) / 2;

        const particleSpacing = 4;
        for (let y = 0; y < sampleHeight; y++) {
          for (let x = 0; x < sampleWidth; x++) {
            const idx = (y * sampleWidth + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const alpha = imgData[idx + 3];

            // If the pixel is opaque enough
            if (alpha > 128) {
              const brightness = (r + g + b) / 3;
              // Only create particles for lighter parts of the image (or all if silhouette)
              if (brightness > 20) {
                const originX = startX + x * particleSpacing;
                const originY = startY + y * particleSpacing;
                
                // Color mapping: interpolate between amber-gold and desaturated tech-teal
                const isAmber = Math.random() > 0.35;
                const color = isAmber 
                  ? `rgba(212, 146, 15, ${0.4 + (brightness / 255) * 0.5})` // Amber
                  : `rgba(74, 155, 138, ${0.3 + (brightness / 255) * 0.4})`; // Tech-Teal
                
                particles.push({
                  x: originX + (Math.random() * 20 - 10),
                  y: originY + (Math.random() * 20 - 10),
                  originX,
                  originY,
                  size: Math.max(1, (brightness / 255) * 2.2),
                  vx: 0,
                  vy: 0,
                  color,
                  density: Math.random() * 10 + 2,
                });
              }
            }
          }
        }
      };

      // Fallback: 3D rotating point-cloud sphere
      img.onerror = () => {
        setImageLoaded(false);
        const isMobile = width < 768;
        const centerX = isMobile ? width / 2 : width * 0.65;
        const centerY = height / 2;
        const radius = isMobile ? 120 : 160;

        const numPoints = 1200;
        for (let i = 0; i < numPoints; i++) {
          // Fibonacci sphere point generation
          const theta = Math.acos(1 - (2 * i) / numPoints);
          const phi = Math.acos(0) * 4 * i / Math.sqrt(numPoints);

          const px = radius * Math.sin(theta) * Math.cos(phi);
          const py = radius * Math.sin(theta) * Math.sin(phi);
          const pz = radius * Math.cos(theta);

          const isAmber = Math.random() > 0.4;
          const color = isAmber 
            ? "rgba(212, 146, 15, 0.45)" // Amber
            : "rgba(74, 155, 138, 0.35)"; // Tech-Teal

          // Store 3D coordinates in origin values
          particles.push({
            x: centerX + px,
            y: centerY + py,
            originX: px, // Stores 3D X
            originY: py, // Stores 3D Y
            size: Math.random() * 1.5 + 0.8,
            vx: pz,      // Stores 3D Z
            vy: 0,
            color,
            density: Math.random() * 12 + 3,
          });
        }
      };
    };

    init();

    // Rotation angle for fallback 3D sphere
    const angleX = 0.003;
    const angleY = 0.004;

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (imageLoaded) {
        // Image Particle Physics (Interactive Grid)
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Distance vector from mouse
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;

          // Max distance for physics
          const maxDistance = mouse.radius;
          let force = (maxDistance - dist) / maxDistance;
          if (force < 0) force = 0;

          // Force multiplier
          const directionX = forceDirectionX * force * p.density;
          const directionY = forceDirectionY * force * p.density;

          if (dist < maxDistance && !reduced) {
            p.x -= directionX;
            p.y -= directionY;
          } else {
            // Spring return to origin
            p.x += (p.originX - p.x) * 0.08;
            p.y += (p.originY - p.y) * 0.08;
          }

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Fallback 3D Sphere Physics
        const isMobile = canvas.width < 768;
        const centerX = isMobile ? canvas.width / 2 : canvas.width * 0.65;
        const centerY = canvas.height / 2;

        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Rotate 3D coordinates (stored in originX, originY, vx)
          // Rotate Y
          const x1 = p.originX * cosY - p.vx * sinY;
          const z1 = p.vx * cosY + p.originX * sinY;
          // Rotate X
          const y2 = p.originY * cosX - z1 * sinX;
          const z2 = z1 * cosX + p.originY * sinX;

          // Save rotated coordinates
          p.originX = x1;
          p.originY = y2;
          p.vx = z2;

          // Projection onto 2D plane (with depth factor)
          const fov = 400;
          const scale = fov / (fov + z2);
          const screenX = centerX + x1 * scale;
          const screenY = centerY + y2 * scale;

          // Mouse interaction (push away)
          const dx = mouse.x - screenX;
          const dy = mouse.y - screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let offsetX = 0;
          let offsetY = 0;
          if (dist < mouse.radius && !reduced) {
            const force = (mouse.radius - dist) / mouse.radius;
            offsetX = -(dx / dist) * force * p.density * 5;
            offsetY = -(dy / dist) * force * p.density * 5;
          }

          // Render projected point
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(screenX + offsetX, screenY + offsetY, p.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [imageSrc, imageLoaded, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
