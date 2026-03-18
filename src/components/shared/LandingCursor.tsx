"use client";

import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  type: "star" | "moon";
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function LandingCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafId = useRef<number>(0);
  const spawnCounter = useRef(0);

  const spawnParticle = useCallback((x: number, y: number) => {
    const type = Math.random() > 0.4 ? "star" : "moon";
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 1.2;

    particles.current.push({
      x,
      y,
      size: type === "star" ? 4 + Math.random() * 8 : 5 + Math.random() * 7,
      opacity: 0.6 + Math.random() * 0.4,
      rotation: Math.random() * 360,
      type,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.3,
      life: 0,
      maxLife: 40 + Math.random() * 30,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getPrimary = () => getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

    const drawStar = (cx: number, cy: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;

      const outer = size;
      const inner = size * 0.35;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        if (i === 0) {
          ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        } else {
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
      }
      ctx.closePath();

      const primary = getPrimary();
      ctx.fillStyle = `hsl(${primary})`;
      ctx.shadowColor = `hsl(${primary} / 0.5)`;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    };

    const drawMoon = (cx: number, cy: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;

      const primary = getPrimary();
      ctx.fillStyle = `hsl(${primary} / 0.8)`;
      ctx.shadowColor = `hsl(${primary} / 0.4)`;
      ctx.shadowBlur = 4;

      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(size * 0.35, -size * 0.2, size * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      ctx.restore();
    };

    const onMouseMove = (e: MouseEvent) => {
      spawnCounter.current += 1;
      if (spawnCounter.current % 2 === 0) {
        spawnParticle(e.clientX, e.clientY);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((particle) => {
        particle.life += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += 1.5;
        particle.vy += 0.01;

        const progress = particle.life / particle.maxLife;
        const fadeOpacity = particle.opacity * (1 - progress);
        const scale = 1 - progress * 0.5;

        if (particle.type === "star") {
          drawStar(particle.x, particle.y, particle.size * scale, particle.rotation, fadeOpacity);
        } else {
          drawMoon(particle.x, particle.y, particle.size * scale, particle.rotation, fadeOpacity);
        }

        return particle.life < particle.maxLife;
      });

      rafId.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998] [@media(pointer:coarse)]:hidden"
    />
  );
}
