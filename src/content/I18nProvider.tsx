"use client";

import { createContext, useContext } from "react";
import { defaultLocale, getDictionary, type Locale } from "./index";

const LocaleContext = createContext<Locale>(defaultLocale);

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Словарь текущей локали для клиентских компонентов. */
export function useDictionary() {
  return getDictionary(useContext(LocaleContext));
}

export function useLocale() {
  return useContext(LocaleContext);
}
