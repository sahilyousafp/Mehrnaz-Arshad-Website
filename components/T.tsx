"use client";

// Renders one translated string. Exists so Server Component pages (which
// can't call the useLocale() hook directly) can drop translated text inline
// without becoming Client Components themselves - see ALink/ProjectCardLink
// for the same pattern applied to click tracking.

import type { TranslationKey } from "@/content/i18n";
import { useLocale } from "./LocaleProvider";

export default function T({ k }: { k: TranslationKey }) {
  const { t } = useLocale();
  return <>{t(k)}</>;
}
