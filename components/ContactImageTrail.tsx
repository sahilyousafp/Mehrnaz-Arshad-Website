"use client";

// Wraps ImageTrail for the contact/footer section: takes the project list in
// its normal (server-rendered) order and shuffles it client-side after
// mount, so hydration always matches the server first, and the trail order
// is different per visit without a hydration-mismatch warning.

import { useEffect, useState } from "react";
import ImageTrail, { type ImageTrailItem } from "./ImageTrail";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ContactImageTrail({ items }: { items: ImageTrailItem[] }) {
  const [order, setOrder] = useState(items);

  useEffect(() => {
    // Randomizing during render (or the initial state initializer) would
    // make this render's output diverge from the server-rendered HTML,
    // which is exactly the hydration mismatch this component exists to
    // avoid - the shuffle has to happen post-mount, in an effect, and only
    // once (re-shuffling on every `items` change would fight the trail).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(shuffle(items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="footer2__trail" aria-hidden>
      <ImageTrail items={order} variant={1} />
    </div>
  );
}
