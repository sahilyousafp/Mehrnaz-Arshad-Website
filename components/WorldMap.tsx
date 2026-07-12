"use client";

// Contact-section map: construction partner network on a real world map,
// cropped to the region the network spans (Atlantic to India). The land
// path is pre-generated (see components/world-land-path.ts); arcs radiate
// from the home base and draw themselves in as the section scrolls through
// the viewport (see --map-progress, set by the scroll listener below), so
// scrolling back up un-draws them again instead of a one-shot reveal.

import { useEffect, useRef } from "react";
import { partnerNetwork } from "@/content/site";
import { WORLD_PATH } from "./world-land-path";

const W = 1000;
const H = 500;
const px = (lon: number) => ((lon + 180) / 360) * W;
const py = (lat: number) => ((90 - lat) / 180) * H;

// Crop to the partner region with breathing room.
const VIEWBOX = "412 55 380 200";

function quadArc(x1: number, y1: number, x2: number, y2: number) {
  const lift = Math.hypot(x2 - x1, y2 - y1) * 0.22;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - lift;
  // Approximate the curve length by sampling.
  let len = 0;
  let prevX = x1;
  let prevY = y1;
  for (let i = 1; i <= 24; i++) {
    const t = i / 24;
    const mt = 1 - t;
    const x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
    const y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
    len += Math.hypot(x - prevX, y - prevY);
    prevX = x;
    prevY = y;
  }
  return { d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, len: Math.ceil(len) };
}

// Hand-tuned label offsets so the dense European cluster stays legible.
const LABELS: Record<string, { dx: number; dy: number; anchor?: "end" }> = {
  Spain: { dx: -7, dy: 4, anchor: "end" },
  "United Kingdom": { dx: -7, dy: 0, anchor: "end" },
  France: { dx: 6, dy: 10 },
  Germany: { dx: 6, dy: -7 },
  Poland: { dx: 7, dy: 9 },
  Turkey: { dx: 7, dy: 4 },
  India: { dx: 7, dy: 4 },
  UAE: { dx: 7, dy: 10 },
  Qatar: { dx: -7, dy: -4, anchor: "end" },
};

export default function WorldMap() {
  const base = partnerNetwork.find((p) => p.isBase)!;
  const bx = px(base.lon);
  const by = py(base.lat);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the map's top enters the bottom of the viewport, 1 once it has
      // travelled 3/4 of the viewport height further up.
      const start = vh;
      const end = vh * 0.25;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      el.style.setProperty("--map-progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="world-map"
      viewBox={VIEWBOX}
      role="img"
      aria-label={`Map of construction partners: ${partnerNetwork.map((p) => p.country).join(", ")}`}
    >
      <path className="world-map__land" d={WORLD_PATH} />

      {partnerNetwork
        .filter((p) => !p.isBase)
        .map((p, i) => {
          const arc = quadArc(bx, by, px(p.lon), py(p.lat));
          return (
            <path
              key={p.country}
              className="world-map__arc"
              d={arc.d}
              style={{ "--arc-len": arc.len, "--i": i } as React.CSSProperties}
            />
          );
        })}

      {partnerNetwork.map((p, i) => {
        const x = px(p.lon);
        const y = py(p.lat);
        const label = LABELS[p.country] ?? { dx: 7, dy: 4 };
        return (
          <g key={p.country} style={{ "--i": i } as React.CSSProperties}>
            <circle className="world-map__dot" cx={x} cy={y} r={p.isBase ? 3.4 : 2.6}>
              <title>{p.partner ? `${p.city} - ${p.partner}` : p.city}</title>
            </circle>
            <text
              className="world-map__label"
              x={x + label.dx}
              y={y + label.dy}
              textAnchor={label.anchor ?? "start"}
            >
              {p.country}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
