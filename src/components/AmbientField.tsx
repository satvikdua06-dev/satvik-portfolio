'use client';

import { useEffect, useRef } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import * as THREE from 'three';

type Props = {
  scrollYProgress: MotionValue<number>;
};

export default function AmbientField({ scrollYProgress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const opacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    // Renderer — alpha:true keeps background transparent so --base-dark shows through
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particle constellation
    const count = isMobile ? 300 : 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24; // X ∈ [-12, 12]
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24; // Y ∈ [-12, 12]
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;  // Z ∈ [-3, 3]
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.015,
      sizeAttenuation: true,
      color: '#C0C0C0',
      transparent: true,
      opacity: 0.6,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse parallax
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX =  (e.clientX / window.innerWidth)  * 2 - 1;
      targetY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!isMobile) {
      window.addEventListener('mousemove', onMouseMove);
    }

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isMobile) {
        camera.position.x += (targetX * 1.5 - camera.position.x) * 0.035;
        camera.position.y += (targetY * 1.5 - camera.position.y) * 0.035;
        camera.lookAt(scene.position);
      }
      points.rotation.y += 0.00015;
      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
      }}
    />
  );
}
