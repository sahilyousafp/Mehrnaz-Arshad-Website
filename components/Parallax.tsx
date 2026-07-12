"use client";

// Scroll-driven parallax, matching the reveal effect on project card images
// at chdartmaker.com: children sit inside an overflow-hidden box, scaled up
// via CSS (see .parallax in globals.css), and this component nudges them up
// or down each frame based on how far the box has travelled through the
// viewport. One shared rAF loop drives every instance on the page.

import { useEffect, useRef, type ReactNode } from "react";

const registry = new Set<HTMLElement>();
let rafId: number | null = null;

function tick() {
  const vh = window.innerHeight;
  for (const el of registry) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) continue;
    const progress = (vh - rect.top) / (vh + rect.height); // 0 entering -> 1 leaving
    const amplitude = rect.height * 0.16;
    const y = (progress - 0.5) * amplitude;
    el.style.setProperty("--parallax-y", `${y.toFixed(1)}px`);
  }
  rafId = requestAnimationFrame(tick);
}

export default function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registry.add(el);
    if (rafId === null) rafId = requestAnimationFrame(tick);
    return () => {
      registry.delete(el);
      if (registry.size === 0 && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, []);

  return (
    <div ref={ref} className={`parallax ${className}`}>
      {children}
    </div>
  );
}
