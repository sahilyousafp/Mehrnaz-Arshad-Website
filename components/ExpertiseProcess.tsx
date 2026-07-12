"use client";

// Hover/focus-driven per-stage reveal for the #expertise section, matching
// the o-expertisesPush interaction at chdartmaker.com (//*[@id="main"]/div[3]):
// hovering a stage word crossfades in a dedicated photo and caption for that
// stage, and dims the other words. Falls back to an ambient background and
// no caption when nothing is active.

import Image from "next/image";
import { useState } from "react";

type Stage = {
  word: string;
  image: string;
  caption: string[];
};

const STAGES: Stage[] = [
  {
    word: "Design",
    image: "/process/design.jpg",
    caption: ["Client brief & concept sketches", "3D CAD modelling", "Layout & material planning"],
  },
  {
    word: "Visualise",
    image: "/process/visualise.jpg",
    caption: ["Photoreal 3D renders", "Client review & revisions", "Final sign-off"],
  },
  {
    word: "Build",
    image: "/process/build.jpg",
    caption: ["Multi-material fabrication", "Joinery, metalwork & finishing", "Quality check before ship"],
  },
  {
    word: "Install",
    image: "/process/install.jpg",
    caption: ["On-site assembly", "Rigging, lighting & AV", "Walkthrough before opening"],
  },
];

export default function ExpertiseProcess({ ambientImage }: { ambientImage: string }) {
  const [active, setActive] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState(0);

  function activate(i: number) {
    setActive(i);
    setLastActive(i);
  }

  function deactivate(i: number) {
    setActive((cur) => (cur === i ? null : cur));
  }

  return (
    <>
      <Image src={ambientImage} alt="" fill sizes="100vw" className="expertise__bg" aria-hidden />
      {STAGES.map((stage, i) => (
        <Image
          key={stage.word}
          src={stage.image}
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className={`expertise__stage-bg${active === i ? " is-active" : ""}`}
        />
      ))}
      <div className="expertise__interactive">
        <ul className="expertise__list">
          {STAGES.map((stage, i) => (
            <li
              key={stage.word}
              tabIndex={0}
              className={`expertise__row${active === i ? " is-active" : ""}${
                active !== null && active !== i ? " is-dim" : ""
              }`}
              onMouseEnter={() => activate(i)}
              onMouseLeave={() => deactivate(i)}
              onFocus={() => activate(i)}
              onBlur={() => deactivate(i)}
            >
              {stage.word}
            </li>
          ))}
        </ul>
        <ul className={`expertise__caption${active !== null ? " is-visible" : ""}`} aria-hidden={active === null}>
          {STAGES[lastActive].caption.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
