"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { EASE_OUT } from "@/lib/ease";
import { Star } from "@/components/ui/Star";

const box: Variants = {
  closed: {
    clipPath: "inset(0% 0% 100% 0%)",
    opacity: 0,
    y: -8,
    transition: { clipPath: { duration: 0.55, ease: EASE_OUT }, opacity: { duration: 0.35 }, y: { duration: 0.55, ease: EASE_OUT } },
  },
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    y: 0,
    transition: { clipPath: { duration: 0.55, ease: EASE_OUT }, opacity: { duration: 0.35 }, y: { duration: 0.55, ease: EASE_OUT } },
  },
};

const item: Variants = {
  closed: { opacity: 0, y: 12, transition: { opacity: { duration: 0.25 }, y: { duration: 0.3 } } },
  open: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { opacity: { duration: 0.5, delay: d / 1000 }, y: { duration: 0.6, ease: EASE_OUT, delay: d / 1000 } },
  }),
};

/** Задержки появления как в прототипе: заголовок колонки, затем ссылки шагом 30мс. */
const COLUMN_DELAYS = [100, 280, 370];
const SIDE_DELAY = 550;

type Props = { open: boolean; onNavigate?: () => void };

/** Панель «Услуги» на всю ширину хедера. Состояние открытия держит Header. */
export function MegaMenu({ open, onNavigate }: Props) {
  const t = useDictionary().megaMenu;

  return (
    <div
      id="mega-menu"
      className="absolute inset-x-0 top-full z-20 whitespace-normal before:absolute before:inset-x-0 before:-top-10 before:h-10 before:content-['']"
      style={{
        visibility: open ? "visible" : "hidden",
        pointerEvents: open ? "auto" : "none",
        transition: open ? "visibility 0s" : "visibility 0s linear .45s",
      }}
      aria-hidden={!open}
    >
      <motion.div
        variants={box}
        initial={false}
        animate={open ? "open" : "closed"}
        className="grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,.9fr)] gap-[clamp(24px,3vw,56px)] border-t-[0.5px] border-t-[rgb(18_21_28/0.08)] bg-white px-[clamp(20px,4vw,56px)] pt-12 pb-14 max-[1200px]:grid-cols-3 max-[700px]:grid-cols-1"
      >
        {t.columns.map((col, ci) => {
          const d0 = COLUMN_DELAYS[ci] ?? 100;
          return (
            <div key={col.title} className="flex min-w-0 flex-col">
              <motion.div
                variants={item}
                custom={d0}
                className="mb-[22px] flex items-baseline gap-2.5 border-b-[0.5px] border-b-transparent pb-4"
              >
                <span className="text-[13px] leading-none font-medium tracking-[.08em] text-ink uppercase">{col.title}</span>
              </motion.div>
              {col.links.map((l, li) => (
                <motion.div key={l.label} variants={item} custom={d0 + 70 + li * 30}>
                  <Link
                    href={l.href}
                    onClick={onNavigate}
                    tabIndex={open ? 0 : -1}
                    className="mm-link flex items-center gap-3 py-[9px] text-[clamp(17px,1.5vw,22px)] leading-[1.25] tracking-[-.015em]"
                  >
                    <span>{l.label}</span>
                    <span className="mm-ar flex-none text-base leading-none">↗</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          );
        })}

        <motion.div
          variants={item}
          custom={SIDE_DELAY}
          className="flex min-w-0 flex-col justify-between gap-8 border-l-[0.5px] border-l-[rgb(18_21_28/0.1)] pl-[clamp(24px,3vw,48px)] max-[1200px]:col-span-full max-[1200px]:flex-row max-[1200px]:items-center max-[1200px]:border-t-[0.5px] max-[1200px]:border-l-0 max-[1200px]:border-t-[rgb(18_21_28/0.1)] max-[1200px]:pt-6 max-[1200px]:pl-0 max-[700px]:flex-col max-[700px]:items-start"
        >
          <p className="m-0 max-w-[300px] text-[17px] leading-7 text-pretty text-muted max-[1200px]:max-w-[420px]">{t.side.text}</p>
          <Link href={t.side.cta.href} onClick={onNavigate} tabIndex={open ? 0 : -1} className="cta-btn cta-dark flex-none self-start">
            {t.side.cta.label} <Star size={14} className="cta-star" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
