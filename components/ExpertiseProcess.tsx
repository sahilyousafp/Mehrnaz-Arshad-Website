"use client";

// Hover/focus-driven per-stage reveal for the #expertise section, matching
// the o-expertisesPush interaction at chdartmaker.com (//*[@id="main"]/div[3]):
// hovering a stage word crossfades in a dedicated photo and caption for that
// stage, and dims the other words. Falls back to an ambient background and
// no caption when nothing is active.

import Image from "next/image";
import { useState } from "react";
import type { TranslationKey } from "@/content/i18n";
import { useLocale } from "./LocaleProvider";

const STAGE_KEYS: {
  id: string;
  image: string;
  word: TranslationKey;
  captions: TranslationKey[];
}[] = [
  {
    id: "design",
    image: "/process/design.jpg",
    word: "stageDesign",
    captions: ["captionDesign1", "captionDesign2", "captionDesign3"],
  },
  {
    id: "visualise",
    image: "/process/visualise.jpg",
    word: "stageVisualise",
    captions: ["captionVisualise1", "captionVisualise2", "captionVisualise3"],
  },
  {
    id: "build",
    image: "/process/build.jpg",
    word: "stageBuild",
    captions: ["captionBuild1", "captionBuild2", "captionBuild3"],
  },
  {
    id: "install",
    image: "/process/install.jpg",
    word: "stageInstall",
    captions: ["captionInstall1", "captionInstall2", "captionInstall3"],
  },
];

export default function ExpertiseProcess({ ambientImage }: { ambientImage: string }) {
  const { t } = useLocale();
  const [active, setActive] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState(0);

  const stages = STAGE_KEYS.map((s) => ({
    id: s.id,
    image: s.image,
    word: t(s.word),
    caption: s.captions.map(t),
  }));

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
      {stages.map((stage, i) => (
        <Image
          key={stage.id}
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
          {stages.map((stage, i) => (
            <li
              key={stage.id}
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
          {stages[lastActive].caption.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
