"use client";

import { useState } from "react";
import { useDictionary, useLocale } from "@/content/I18nProvider";
import { Globe } from "@/components/ui/Icons";

/** Глобус-переключатель языка. Пока только UI: EN появится вместе с en.ts. */
export function LangSwitch() {
  const t = useDictionary().common;
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative flex-none"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={t.language}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="header-icon-btn flex size-11 items-center justify-center border-0 bg-transparent p-0 text-white transition-[opacity,color] duration-300 hover:opacity-60"
      >
        <Globe />
      </button>
      <div
        className="absolute top-[calc(100%+8px)] right-0 z-30 flex min-w-[120px] flex-col border-[0.5px] border-white/14 bg-[rgb(10_14_21/0.75)] p-1.5 backdrop-blur-[20px] transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-out-expo)]"
        style={{ opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden", transform: open ? "translateY(0)" : "translateY(-6px)" }}
      >
        {t.locales.map((l) => {
          const active = l.code === locale;
          return (
            <button
              key={l.code}
              type="button"
              aria-current={active ? "true" : undefined}
              tabIndex={open ? 0 : -1}
              className={`border-0 bg-transparent px-3 py-2.5 text-left text-sm leading-none transition-colors ${active ? "font-medium text-white" : "text-faint hover:text-white"}`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
