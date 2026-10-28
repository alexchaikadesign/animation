"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { COUNTRIES, applyMask, detectCountry, findCountry, normalizeInput } from "@/lib/phone";
import { EASE_OUT } from "@/lib/ease";

export type PhoneValue = { country: string; number: string };

type Props = {
  value: PhoneValue;
  onChange: (v: PhoneValue) => void;
  theme?: "light" | "dark";
  invalid?: boolean;
  errorId?: string;
  name?: string;
  label: string;
};

/* eslint-disable @next/next/no-img-element -- флаги с flagcdn.com, как в прототипе */
function Flag({ iso }: { iso: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
      alt=""
      width={22}
      height={16}
      loading="lazy"
      className="block h-4 w-[22px] flex-none rounded-[3px] bg-white/10 object-cover shadow-[0_0_0_0.5px_rgba(127,127,127,.35)]"
    />
  );
}
/* eslint-enable @next/next/no-img-element */

/** Телефон с выбором страны, флагами, масками и автоопределением страны. */
export function PhoneField({ value, onChange, theme = "dark", invalid, errorId, name = "phone", label }: Props) {
  const t = useDictionary().phone;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const country = findCountry(value.country);
  const dark = theme === "dark";

  // автоопределение страны — один раз, если пользователь ещё ничего не ввёл
  const detected = useRef(false);
  useEffect(() => {
    if (detected.current || value.number) return;
    detected.current = true;
    const iso = detectCountry();
    if (iso !== value.country) onChange({ country: iso, number: "" });
  }, [value, onChange]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const pick = (iso: string) => {
    const c = findCountry(iso);
    onChange({ country: iso, number: applyMask(normalizeInput(value.number, c), c.mask) });
    setOpen(false);
    requestAnimationFrame(() => input.current?.focus());
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") setActive((i) => Math.min(COUNTRIES.length - 1, i + 1));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    else if (e.key === "Enter") pick(COUNTRIES[active].iso);
    else if (e.key === "Escape") setOpen(false);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className="relative block">
      <div
        className={`flex items-center gap-3.5 border-b-[0.5px] transition-colors duration-300 focus-within:border-[var(--field-focus)] ${
          invalid ? "border-danger" : "border-[var(--field-line)]"
        }`}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={t.countries[country.iso]}
          onClick={() => {
            setActive(COUNTRIES.findIndex((c) => c.iso === country.iso));
            setOpen((o) => !o);
          }}
          onKeyDown={(e) => open && onListKey(e)}
          className="flex flex-none items-center gap-2 border-0 bg-transparent pt-[22px] pb-4 text-[var(--field-fs,17px)] leading-[1.4] text-[var(--field-c)]"
        >
          <Flag iso={country.iso} />
          <span>+{country.code}</span>
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-60"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <span className="mt-1.5 h-5 w-[0.5px] flex-none bg-[var(--field-line)]" />
        <input
          ref={input}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-label={label}
          aria-invalid={invalid || undefined}
          aria-describedby={errorId}
          placeholder={country.mask.replace(/0/g, "_")}
          value={value.number}
          onChange={(e) => onChange({ country: country.iso, number: applyMask(normalizeInput(e.target.value, country), country.mask) })}
          className="min-w-0 flex-1 border-0 bg-transparent pt-[22px] pb-4 text-[var(--field-fs,17px)] leading-[1.4] text-[var(--field-c)] outline-none"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={t.search}
            tabIndex={-1}
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ opacity: { duration: 0.25 }, default: { duration: 0.35, ease: EASE_OUT } }}
            className={`no-scrollbar absolute top-full left-0 z-20 m-0 mt-2.5 max-h-[300px] w-[300px] origin-top-left list-none overflow-auto p-2 ${
              dark
                ? "border-[0.5px] border-white/22 bg-[linear-gradient(160deg,rgba(255,255,255,.14),rgba(255,255,255,.05))] shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_24px_60px_rgba(0,0,0,.35)] backdrop-blur-[28px] backdrop-saturate-[1.6]"
                : "border-[0.5px] border-[rgb(18_21_28/0.12)] bg-white shadow-[0_24px_60px_rgba(10,14,21,.14)]"
            }`}
          >
            {COUNTRIES.map((c, i) => (
              <li
                key={c.iso}
                role="option"
                aria-selected={c.iso === country.iso}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(c.iso)}
                className={`flex cursor-pointer items-center gap-3 px-3.5 py-[11px] text-[15px] leading-[1.3] transition-colors duration-200 ${
                  dark ? "text-white" : "text-ink"
                } ${i === active ? (dark ? "bg-white/12" : "bg-[rgb(18_21_28/0.05)]") : ""}`}
              >
                <Flag iso={c.iso} />
                <span className="flex-1">{t.countries[c.iso]}</span>
                <span className={dark ? "text-white/60" : "text-muted"}>+{c.code}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
