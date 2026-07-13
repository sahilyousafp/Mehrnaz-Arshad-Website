"use client";

// Client-only language toggle (no /en, /es routes) - the whole site is a
// single static page per project, and there's no server-side way to know a
// visitor's chosen language without a route segment, so we persist it in
// localStorage and default every page to English on first paint (matching
// what's actually in the server-rendered HTML, so no hydration mismatch).

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { type Locale, type TranslationKey, translate } from "@/content/i18n";

const STORAGE_KEY = "locale";
const CHANGE_EVENT = "locale-change";

// localStorage is the single source of truth for the current locale, read
// through useSyncExternalStore so the server/first-hydration snapshot is
// always "en" (matching the server-rendered HTML - no mismatch) and the
// real stored value only takes over once the client subscribes, without
// ever calling setState directly inside an effect.
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "es" ? stored : "en";
}

function getServerSnapshot(): Locale {
  return "en";
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
