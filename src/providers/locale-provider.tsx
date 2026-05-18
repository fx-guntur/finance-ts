import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { LocaleCode } from "../i18n/messages";
import { defaultLocale, getTranslation } from "../i18n/messages";

type LocaleContextValue = {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  toggleLocale: () => void;
  t: (key: Parameters<typeof getTranslation>[1]) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function readStoredLocale(): LocaleCode {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const stored = window.localStorage.getItem("finance-locale");
  return stored === "en" ? "en" : "id";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleCode>(() => readStoredLocale());

  useEffect(() => {
    window.localStorage.setItem("finance-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale: () => setLocale((current) => (current === "id" ? "en" : "id")),
      t: (key) => getTranslation(locale, key),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return value;
}
