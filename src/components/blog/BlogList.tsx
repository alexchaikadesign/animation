"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { EASE_OUT } from "@/lib/ease";
import { ArrowUpRight } from "@/components/ui/Icons";

/** Фильтр по категориям + список статей. */
export function BlogList() {
  const t = useDictionary().blog;
  const [cat, setCat] = useState(t.all);
  const cats = useMemo(() => [t.all, ...Array.from(new Set(t.posts.map((p) => p.cat)))], [t]);
  const posts = t.posts.filter((p) => cat === t.all || p.cat === cat);

  return (
    <>
      <div className="mt-14 flex flex-wrap gap-2" role="tablist">
        {cats.map((c) => {
          const on = c === cat;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setCat(c)}
              className={`rounded-full border-[0.5px] px-[18px] py-2.5 text-[15px] leading-none transition-[background-color,color,border-color] duration-300 ${
                on ? "border-ink bg-ink text-white" : "border-[rgb(18_21_28/0.18)] bg-transparent text-ink hover:border-ink"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-[72px] hairline-b">
        <AnimatePresence mode="popLayout" initial={false}>
          {posts.map((p, k) => (
            <motion.a
              key={p.title}
              href="#"
              layout
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="post hairline-t relative block text-ink"
            >
              <span className="post-line absolute inset-x-0 -top-px h-px bg-ink" />
              <div className="grid min-h-[376px] grid-cols-2 gap-20 pt-7 pb-12 max-tb:min-h-0 max-tb:grid-cols-1 max-tb:gap-[22px]">
                <div className="flex flex-col gap-[42px] max-tb:gap-6">
                  <span className="text-xs leading-none tracking-[.08em] text-faint-2 uppercase">
                    ( {p.cat} {String(k + 1).padStart(2, "0")} )
                  </span>
                  <div className="flex items-start gap-4">
                    <h2 className="post-t m-0 max-w-[520px] text-[clamp(28px,2.6vw,40px)] leading-[1.1] font-medium tracking-[-.025em] text-balance text-ink">
                      {p.title}
                    </h2>
                    <ArrowUpRight size={26} className="post-arr mt-1.5 flex-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-6 pt-[54px] max-tb:pt-0">
                  <p className="m-0 max-w-[440px] text-[17px] leading-7 text-pretty text-muted">{p.text}</p>
                  <div className="flex gap-[18px] text-sm leading-none text-faint-2">
                    <span>{p.date}</span>
                    <span>{p.time}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
