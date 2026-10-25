"use client";

import { useEffect, useRef } from "react";

type Petal = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; life: number; size: number; color: string };

const COLORS = ["#F7B8D2", "#EE8DB8", "#E2589B", "#F9C9DC"];

// Pétalas que caem do cursor dentro do elemento pai; um clique solta uma rajada.
export function PetalTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const petals: Petal[] = [];
    let raf = 0;
    let last = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = host.clientWidth * dpr;
      canvas.height = host.clientHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const spawn = (x: number, y: number, power = 1) => {
      petals.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.6 * power,
        vy: (Math.random() * -1.2 - 0.3) * power,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.12,
        life: 1,
        size: 5 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
      if (petals.length > 140) petals.shift();
    };

    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      const [x, y] = local(e);
      spawn(x, y);
    };
    const onDown = (e: PointerEvent) => {
      const [x, y] = local(e);
      for (let i = 0; i < 18; i++) spawn(x, y, 3.2);
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onDown);

    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.vy += 0.035;
        p.vx += Math.sin(p.rot * 2) * 0.03;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.009;
        if (p.life <= 0) {
          petals.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life * 1.4);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full" />;
}
