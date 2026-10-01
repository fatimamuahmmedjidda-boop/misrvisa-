"use client";

import { animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const HeroScene = dynamic(() => import("@/components/site/HeroScene"), { ssr: false });

export function FadeIn({
  children,
  delay = 0,
  y = 16,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.45, delay: Math.min(delay, 0.15), ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Card that tilts in 3D toward the pointer, with a gold spotlight following it. */
export function TiltCard({ children, className = "", max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });
  const sx = useTransform(mx, (v) => `${v * 100}%`);
  const sy = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx} ${sy}, rgba(235,196,135,0.16), transparent 60%)`;

  return (
    <div className="perspective h-full">
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          if (reduced || e.pointerType === "touch") return;
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: reduced ? 0 : rx, rotateY: reduced ? 0 : ry }}
        className={`gold-frame preserve-3d relative h-full overflow-hidden rounded-[28px] bg-white/[0.03] ${className}`}
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
        <div className="relative h-full [transform:translateZ(30px)]">{children}</div>
      </motion.div>
    </div>
  );
}

export function Counter({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {inView ? value.toFixed(decimals) : to.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-gold/10 bg-night-900/60 py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-xl italic text-ivory/55 sm:text-2xl">
            {item}
            <span aria-hidden className="h-2 w-2 rotate-45 bg-gold/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Decorative (non-scannable) QR pattern, deterministic so server and client match. */
export function QrPattern({ className = "", color = "#04140f" }: { className?: string; color?: string }) {
  const n = 25;
  let seed = 1337;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const cells: [number, number][] = [];
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inFinder(x, y) && rand() > 0.52) cells.push([x, y]);
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill={color} />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#faf7f1" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill={color} />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} shapeRendering="crispEdges" aria-hidden>
      <rect width={n} height={n} fill="#faf7f1" />
      {cells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" fill={color} />
      ))}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}
