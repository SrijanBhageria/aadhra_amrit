'use client';

import { useEffect, useRef } from 'react';
import styles from './Confetti.module.css';

interface ConfettiProps {
  active?: boolean;
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  w: number;
  h: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  opacity: number;
}

const COLORS = ['#0D2E28', '#1A4A3F', '#B85A2A', '#C9A961', '#D17A4A', '#3D2F24', '#FFFFFF'];

function createBurst(width: number, height: number): Particle[] {
  const originX = width / 2;
  const originY = height * 0.35;
  const particles: Particle[] = [];

  for (let i = 0; i < 120; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = Math.random() * 14 + 4;
    particles.push({
      x: originX + (Math.random() - 0.5) * 120,
      y: originY + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.18 + Math.random() * 0.08,
      opacity: 1,
    });
  }

  return particles;
}

export default function Confetti({ active = true, duration = 4500 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let particles = createBurst(window.innerWidth, window.innerHeight);
    const start = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => p.opacity > 0.05 && p.y < canvas.height + 40);

      for (const p of particles) {
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        if (elapsed > duration * 0.6) {
          p.opacity -= 0.012;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (elapsed < duration && particles.length > 0) {
        animationId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationId = requestAnimationFrame(tick);

    // Second burst for extra celebration
    const burst2 = window.setTimeout(() => {
      particles = [...particles, ...createBurst(window.innerWidth, window.innerHeight)];
    }, 400);

    return () => {
      cancelAnimationFrame(animationId);
      window.clearTimeout(burst2);
      window.removeEventListener('resize', resize);
    };
  }, [active, duration]);

  if (!active) return null;

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
