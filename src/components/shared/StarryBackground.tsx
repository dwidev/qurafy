"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface BgStar {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  type: "star" | "moon";
  rotation: number;
}

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<BgStar[]>([]);
  const rafRef = useRef<number>(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || resolvedTheme !== "dark") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    const generateStars = () => {
      const stars: BgStar[] = [];
      const count = Math.floor((window.innerWidth * window.innerHeight) / 5000);

      for (let i = 0; i < count; i++) {
        const isMoon = Math.random() > 0.9;
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: isMoon ? 4 + Math.random() * 6 : 1 + Math.random() * 2.5,
          baseOpacity: 0.15 + Math.random() * 0.5,
          twinkleSpeed: 0.008 + Math.random() * 0.02,
          twinkleOffset: Math.random() * Math.PI * 2,
          type: isMoon ? "moon" : "star",
          rotation: Math.random() * 360,
        });
      }
      starsRef.current = stars;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars();
    };
    resize();
    window.addEventListener("resize", resize);

    const drawStar = (cx: number, cy: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = opacity;

      // Soft glow
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3);
      grad.addColorStop(0, `rgba(200, 220, 255, ${opacity})`);
      grad.addColorStop(0.4, `rgba(180, 210, 255, ${opacity * 0.2})`);
      grad.addColorStop(1, "rgba(180, 210, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Bright center dot
      ctx.fillStyle = `rgba(230, 240, 255, ${Math.min(opacity * 1.5, 1)})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Cross rays
      ctx.strokeStyle = `rgba(210, 230, 255, ${opacity * 0.35})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-size * 2, 0);
      ctx.lineTo(size * 2, 0);
      ctx.moveTo(0, -size * 2);
      ctx.lineTo(0, size * 2);
      ctx.stroke();

      ctx.restore();
    };

    const drawMoon = (cx: number, cy: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;

      // Soft glow behind moon
      const grad = ctx.createRadialGradient(0, 0, size * 0.5, 0, 0, size * 3);
      grad.addColorStop(0, `rgba(200, 215, 255, ${opacity * 0.25})`);
      grad.addColorStop(1, "rgba(200, 215, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw crescent using two arcs (no destination-out needed)
      ctx.fillStyle = `rgba(210, 230, 255, ${opacity * 0.7})`;
      ctx.beginPath();
      // Outer arc (full moon shape)
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      // Inner arc (cutout) — draw counter-clockwise to create crescent
      ctx.arc(size * 0.4, -size * 0.2, size * 0.78, 0, Math.PI * 2, true);
      ctx.fill("evenodd");

      ctx.restore();
    };

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      for (const s of starsRef.current) {
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        const opacity = s.baseOpacity * (0.4 + 0.6 * ((twinkle + 1) / 2));

        if (s.type === "star") {
          drawStar(s.x, s.y, s.size, opacity);
        } else {
          drawMoon(s.x, s.y, s.size, s.rotation, opacity);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, resolvedTheme]);

  // Don't render until mounted & dark mode
  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
