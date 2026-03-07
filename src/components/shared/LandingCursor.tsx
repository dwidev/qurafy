"use client";

import { useEffect, useRef, useCallback } from "react";

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
  const cursorRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const prevMouse = useRef({ x: -100, y: -100 });
  const isMoving = useRef(false);
  const moveTimeout = useRef<NodeJS.Timeout | null>(null);
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
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;

    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      prevMouse.current = { ...mouse.current };
      mouse.current = { x: e.clientX, y: e.clientY };
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.style.opacity = "1";

      isMoving.current = true;
      if (moveTimeout.current) clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => {
        isMoving.current = false;
      }, 150);

      // Spawn particles while moving
      spawnCounter.current++;
      if (spawnCounter.current % 2 === 0) {
        spawnParticle(e.clientX, e.clientY);
      }
    };

    const onMouseLeave = () => {
      if (cursor) cursor.style.opacity = "0";
    };
    const onMouseEnter = () => {
      if (cursor) cursor.style.opacity = "1";
    };

    const drawStar = (cx: number, cy: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;

      // 4-pointed star
      const outer = size;
      const inner = size * 0.35;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();

      // Get primary color from CSS variable
      const style = getComputedStyle(document.documentElement);
      const primary = style.getPropertyValue("--primary").trim();
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

      const style = getComputedStyle(document.documentElement);
      const primary = style.getPropertyValue("--primary").trim();
      ctx.fillStyle = `hsl(${primary} / 0.8)`;
      ctx.shadowColor = `hsl(${primary} / 0.4)`;
      ctx.shadowBlur = 4;

      // Crescent moon
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();

      // Cut out inner circle for crescent
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(size * 0.35, -size * 0.2, size * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      particles.current = particles.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += 1.5;
        p.vy += 0.01; // slight gravity

        const progress = p.life / p.maxLife;
        const fadeOpacity = p.opacity * (1 - progress);
        const scale = 1 - progress * 0.5;

        if (p.type === "star") {
          drawStar(p.x, p.y, p.size * scale, p.rotation, fadeOpacity);
        } else {
          drawMoon(p.x, p.y, p.size * scale, p.rotation, fadeOpacity);
        }

        return p.life < p.maxLife;
      });

      // Update cursor visual
      if (cursor) {
        const moving = isMoving.current;
        cursor.style.transform = `translate(-50%, -50%) scale(${moving ? 0.5 : 1})`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("resize", resize);
      if (moveTimeout.current) clearTimeout(moveTimeout.current);
      cancelAnimationFrame(rafId.current);
    };
  }, [spawnParticle]);

  return (
    <>
      <style>{`
        .landing-cursor-area { cursor: none; }
        .landing-cursor-area a,
        .landing-cursor-area button,
        .landing-cursor-area [role="button"] { cursor: none; }
        @media (pointer: coarse) {
          .landing-cursor-area { cursor: auto; }
          .custom-cursor, .cursor-canvas { display: none !important; }
        }
      `}</style>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="cursor-canvas pointer-events-none fixed inset-0 z-9998"
      />

      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="custom-cursor pointer-events-none fixed z-9999"
        style={{
          left: -100,
          top: -100,
          opacity: 0,
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        }}
      >
        {/* Star */}
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary fill-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
        </svg>

        {/* Mini moons around */}
        <svg viewBox="0 0 24 24" className="absolute -top-2 -right-2 h-3 w-3 text-primary/60 fill-primary/60">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
        <svg viewBox="0 0 24 24" className="absolute -bottom-1 -left-2 h-2.5 w-2.5 text-primary/40 fill-primary/40">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      </div>
    </>
  );
}
