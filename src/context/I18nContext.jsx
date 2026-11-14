"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { LANGUAGES, DEFAULT_LOCALE } from "../i18n/languages";
import { TRANSLATIONS } from "../i18n/translations";

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key, fallback = "") => fallback || key,
  currentLanguage: LANGUAGES[0],
  dir: "ltr",
  languages: LANGUAGES,
});

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem("fastedl_lang");
      let active = DEFAULT_LOCALE;

      if (savedLocale && LANGUAGES.some((l) => l.code === savedLocale)) {
        active = savedLocale;
      } else if (typeof navigator !== "undefined" && navigator.language) {
        const browserCode = navigator.language.split("-")[0].toLowerCase();
        if (LANGUAGES.some((l) => l.code === browserCode)) {
          active = browserCode;
        }
      }

      setLocaleState(active);
      const langMeta = LANGUAGES.find((l) => l.code === active) || LANGUAGES[0];
      document.documentElement.lang = active;
      document.documentElement.dir = langMeta.dir || "ltr";
    } catch (e) {}
    setMounted(true);
  }, []);

  const setLocale = (newLocale) => {
    const valid = LANGUAGES.some((l) => l.code === newLocale) ? newLocale : DEFAULT_LOCALE;
    setLocaleState(valid);
    try {
      localStorage.setItem("fastedl_lang", valid);
      const langMeta = LANGUAGES.find((l) => l.code === valid) || LANGUAGES[0];
      document.documentElement.lang = valid;
      document.documentElement.dir = langMeta.dir || "ltr";
    } catch (e) {}
  };

  const currentLanguage = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];
  const dir = currentLanguage.dir || "ltr";

  // Safe translation resolver with English fallback
  const t = (path, fallback = "") => {
    if (!path) return fallback;

    const resolvePath = (obj, p) => {
      if (!obj) return undefined;
      const parts = p.split(".");
      let cur = obj;
      for (const part of parts) {
        if (cur && typeof cur === "object" && part in cur) {
          cur = cur[part];
        } else {
          return undefined;
        }
      }
      return typeof cur === "string" ? cur : undefined;
    };

    // 1. Try active locale
    const localized = resolvePath(TRANSLATIONS[locale], path);
    if (localized !== undefined) return localized;

    // 2. Fall back to English
    const fallbackEn = resolvePath(TRANSLATIONS[DEFAULT_LOCALE], path);
    if (fallbackEn !== undefined) return fallbackEn;

    // 3. Fall back to user-provided fallback string or clean humanized last part
    if (fallback) return fallback;
    const parts = path.split(".");
    return parts[parts.length - 1];
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        currentLanguage,
        dir,
        languages: LANGUAGES,
        mounted,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}

