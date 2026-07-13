"use client";

// Thin client wrapper so the Server Component project detail page can get a
// translated aria-label on the <nav> - same reasoning as ALink/ProjectCardLink/T.

import type { ReactNode } from "react";
import { useLocale } from "./LocaleProvider";

export default function ProjectNav({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  return (
    <nav className="project-nav" aria-label={t("moreProjectsAria")}>
      {children}
    </nav>
  );
}
