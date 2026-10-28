import { ru, type Dictionary } from "./ru";

export const locales = ["ru"] as const; // добавить "en" после появления en.ts
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

const dictionaries: Record<Locale, Dictionary> = { ru };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export type { Dictionary };
