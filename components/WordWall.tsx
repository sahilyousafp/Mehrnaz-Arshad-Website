"use client";

// Giant typographic wall. Rows drift horizontally as the page scrolls,
// alternating direction, echoing the keyword wall on the reference site.

import { useEffect, useRef, type ReactNode } from "react";

export default function WordWall({ rows }: { rows: ReactNode[] }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = Array.from(el.querySelectorAll<HTMLElement>(".wordwall__row"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      lines.forEach((line, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        line.style.transform = `translateX(${dir * (progress * 10 - 5)}%)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="wordwall" ref={wrap} aria-hidden>
      {rows.map((row, i) => (
        <div className="wordwall__row" key={i}>
          {row}
        </div>
      ))}
    </div>
  );
}
