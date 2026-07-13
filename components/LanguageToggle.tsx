"use client";

import { useLocale } from "./LocaleProvider";

export default function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`lang-toggle${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Language"
      data-locale={locale}
    >
      <span className="lang-toggle__thumb" aria-hidden />
      <button
        type="button"
        className={locale === "en" ? "is-active" : undefined}
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "es" ? "is-active" : undefined}
        aria-pressed={locale === "es"}
        onClick={() => setLocale("es")}
      >
        ES
      </button>
    </div>
  );
}
