"use client";

// Wall of event/venue logos. Rows drift horizontally as the page scrolls,
// alternating direction, echoing the keyword wall on the reference site.

import Image from "next/image";
import { useEffect, useRef } from "react";

export type LogoWallLogo = {
  /** Public URL of the logo image */
  src: string;
  /** Event/venue name, used as alt text */
  name: string;
  width: number;
  height: number;
  /** Light artwork or dark background - invert to read on the white page */
  invert?: boolean;
};

export default function LogoWall({ rows }: { rows: LogoWallLogo[][] }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = Array.from(el.querySelectorAll<HTMLElement>(".logowall__row"));
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
    <div className="logowall" ref={wrap}>
      {rows.map((row, i) => (
        <div className="logowall__row" key={i}>
          {row.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.name}
              title={logo.name}
              width={logo.width}
              height={logo.height}
              className={`logowall__logo${logo.invert ? " logowall__logo--invert" : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
