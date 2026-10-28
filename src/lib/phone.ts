/** Страны, коды и маски поля телефона (перенесено из phone-field.js прототипа). */
export type Country = { iso: string; code: string; mask: string };

export const COUNTRIES: Country[] = [
  { iso: "RU", code: "7", mask: "(000) 000-00-00" },
  { iso: "KZ", code: "7", mask: "(000) 000-00-00" },
  { iso: "BY", code: "375", mask: "00 000-00-00" },
  { iso: "UA", code: "380", mask: "00 000-00-00" },
  { iso: "UZ", code: "998", mask: "00 000-00-00" },
  { iso: "AM", code: "374", mask: "00 000-000" },
  { iso: "GE", code: "995", mask: "000 00-00-00" },
  { iso: "AZ", code: "994", mask: "00 000-00-00" },
  { iso: "KG", code: "996", mask: "000 000-000" },
  { iso: "AE", code: "971", mask: "00 000-0000" },
  { iso: "TR", code: "90", mask: "(000) 000-00-00" },
  { iso: "IL", code: "972", mask: "00-000-0000" },
  { iso: "CY", code: "357", mask: "00 000000" },
  { iso: "RS", code: "381", mask: "00 000-0000" },
  { iso: "DE", code: "49", mask: "000 00000000" },
  { iso: "GB", code: "44", mask: "0000 000000" },
  { iso: "US", code: "1", mask: "(000) 000-0000" },
  { iso: "ES", code: "34", mask: "000 00 00 00" },
  { iso: "FR", code: "33", mask: "0 00 00 00 00" },
  { iso: "IT", code: "39", mask: "000 000 0000" },
  { iso: "PL", code: "48", mask: "000 000 000" },
  { iso: "NL", code: "31", mask: "0 00000000" },
  { iso: "TH", code: "66", mask: "00 000 0000" },
  { iso: "ID", code: "62", mask: "000-0000-0000" },
];

const TZ: Record<string, string> = {
  "Europe/Moscow": "RU",
  "Europe/Samara": "RU",
  "Europe/Volgograd": "RU",
  "Europe/Kaliningrad": "RU",
  "Asia/Yekaterinburg": "RU",
  "Asia/Omsk": "RU",
  "Asia/Novosibirsk": "RU",
  "Asia/Krasnoyarsk": "RU",
  "Asia/Irkutsk": "RU",
  "Asia/Yakutsk": "RU",
  "Asia/Vladivostok": "RU",
  "Asia/Magadan": "RU",
  "Asia/Kamchatka": "RU",
  "Asia/Almaty": "KZ",
  "Asia/Qostanay": "KZ",
  "Asia/Aqtobe": "KZ",
  "Asia/Aqtau": "KZ",
  "Asia/Atyrau": "KZ",
  "Asia/Oral": "KZ",
  "Asia/Qyzylorda": "KZ",
  "Europe/Minsk": "BY",
  "Europe/Kyiv": "UA",
  "Europe/Kiev": "UA",
  "Asia/Tashkent": "UZ",
  "Asia/Samarkand": "UZ",
  "Asia/Yerevan": "AM",
  "Asia/Tbilisi": "GE",
  "Asia/Baku": "AZ",
  "Asia/Bishkek": "KG",
  "Asia/Dubai": "AE",
  "Europe/Istanbul": "TR",
  "Asia/Jerusalem": "IL",
  "Asia/Tel_Aviv": "IL",
  "Asia/Nicosia": "CY",
  "Asia/Famagusta": "CY",
  "Europe/Belgrade": "RS",
  "Europe/Berlin": "DE",
  "Europe/London": "GB",
  "Europe/Madrid": "ES",
  "Europe/Paris": "FR",
  "Europe/Rome": "IT",
  "Europe/Warsaw": "PL",
  "Europe/Amsterdam": "NL",
  "Asia/Bangkok": "TH",
  "Asia/Jakarta": "ID",
};

export const DEFAULT_COUNTRY = "BY";

export function findCountry(iso: string): Country {
  return COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];
}

/** Автоопределение страны по часовому поясу, затем по языку браузера. */
export function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TZ[tz]) return TZ[tz];
    if (tz?.startsWith("America/")) return "US";
  } catch {}
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ""];
  for (const l of langs) {
    const region = (l.split("-")[1] || "").toUpperCase();
    if (COUNTRIES.some((c) => c.iso === region)) return region;
  }
  return DEFAULT_COUNTRY;
}

export const maskDigits = (mask: string) => (mask.match(/0/g) || []).length;

export function applyMask(digits: string, mask: string): string {
  let out = "";
  let i = 0;
  for (const ch of mask) {
    if (i >= digits.length) break;
    out += ch === "0" ? digits[i++] : ch;
  }
  return out;
}

/** Нормализация ввода: убирает код страны при вставке «+375…», ведущую 8 для +7. */
export function normalizeInput(raw: string, country: Country): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith(country.code) && d.length > maskDigits(country.mask)) d = d.slice(country.code.length);
  if (country.code === "7" && d.length > 10 && d[0] === "8") d = d.slice(1);
  return d.slice(0, maskDigits(country.mask));
}

/** Полный номер в E.164 (+375445606626) либо null, если номер неполный. */
export function toE164(iso: string, formatted: string): string | null {
  const c = findCountry(iso);
  const d = formatted.replace(/\D/g, "");
  return d.length === maskDigits(c.mask) ? `+${c.code}${d}` : null;
}
