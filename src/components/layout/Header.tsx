"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { icons } from "@/lib/images";
import { EASE_OUT } from "@/lib/ease";
import { Star } from "@/components/ui/Star";
import { Chevron, Close } from "@/components/ui/Icons";
import { MegaMenu } from "./MegaMenu";
import { LangSwitch } from "./LangSwitch";
import { useContactDrawer } from "./ContactDrawer";

type Props = {
  /** Сообщает родителю (Hero), что мега-меню открыто — для затемнения фона. */
  onMegaMenuChange?: (open: boolean) => void;
};

/** Хедер главной: прозрачный поверх hero, инвертируется в белый при открытом мега-меню. */
export function Header({ onMegaMenuChange }: Props) {
  const t = useDictionary();
  const drawer = useContactDrawer();
  const [mmOpen, setMmOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setMenu = useCallback(
    (open: boolean) => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setMmOpen(open);
      onMegaMenuChange?.(open);
    },
    [onMegaMenuChange],
  );

  useEffect(() => {
    if (!mmOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mmOpen, setMenu]);

  return (
    <header
      data-inverted={mmOpen}
      className="site-header anim-rise relative z-[6] flex flex-nowrap items-center gap-[clamp(16px,3vw,52px)] px-[clamp(20px,4vw,56px)] py-[30px] max-md:py-5"
      style={{ animationDuration: ".5s", animationDelay: ".03s", animationFillMode: "backwards" }}
    >
      <Link href="/" className="flex flex-none items-center" aria-label="reacto.tech">
        <Image src={icons.logo} alt="reacto.tech" width={140} height={34} priority unoptimized className="logo-img block h-[26px] w-auto" />
      </Link>

      <nav
        className="flex min-w-0 flex-nowrap items-center gap-[clamp(18px,2.6vw,48px)] whitespace-nowrap max-md:hidden"
        aria-label="Основное меню"
      >
        {/* статичная позиция: панель меряется от хедера на всю ширину */}
        <div
          className="static flex"
          onMouseEnter={() => setMenu(true)}
          onMouseLeave={() => setMenu(false)}
          onFocus={() => setMenu(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenu(false);
          }}
        >
          <button
            type="button"
            className="navlink inline-flex items-center gap-1.5 border-0 bg-transparent"
            data-active={mmOpen}
            aria-expanded={mmOpen}
            aria-controls="mega-menu"
            onClick={() => setMenu(!mmOpen)}
          >
            {t.nav.services}
            <Chevron className="mm-chev" />
          </button>
          <MegaMenu open={mmOpen} onNavigate={() => setMenu(false)} />
        </div>
        {t.nav.items.map((item) => (
          <Link key={item.label} href={item.href} className={`navlink ${item.wide ? "max-nav:hidden" : ""}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="min-w-0 flex-1" />

      <button type="button" className="cta-btn flex-none max-md:hidden" onClick={() => drawer?.open()}>
        {t.common.discussProject} <Star size={14} className="cta-star" />
      </button>
      <div className="max-md:hidden">
        <LangSwitch />
      </div>

      <button
        type="button"
        className="header-icon-btn hidden size-11 items-center justify-center border-0 bg-transparent text-white max-md:flex"
        aria-label={t.common.menu}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
          <path d="M3 8h18M3 16h18" />
        </svg>
      </button>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} onCta={() => drawer?.open()} />
    </header>
  );
}

/** Мобильное меню (< 768px): в прототипе отсутствует, хедер там не помещается. */
function MobileMenu({ open, onClose, onCta }: { open: boolean; onClose: () => void; onCta: () => void }) {
  const t = useDictionary();

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // hero-обёртка трансформируется при скролле, поэтому fixed-слой выносим в body
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex flex-col overflow-y-auto bg-night px-5 pt-5 pb-8 text-white md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.common.menu}
        >
          <div className="flex items-center justify-between">
            <Image src={icons.logo} alt="reacto.tech" width={140} height={34} unoptimized className="block h-[26px] w-auto" />
            <button
              type="button"
              onClick={onClose}
              aria-label={t.common.close}
              className="flex size-11 items-center justify-center border-0 bg-transparent text-white"
            >
              <Close size={22} />
            </button>
          </div>

          <nav className="mt-10 flex flex-col">
            {t.megaMenu.columns.map((col, ci) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 + ci * 0.06 }}
                className="border-b-[0.5px] border-white/10 py-5"
              >
                <span className="text-[13px] leading-none font-medium tracking-[.08em] text-faint uppercase">{col.title}</span>
                <div className="mt-3 flex flex-col">
                  {col.links.map((l) => (
                    <Link key={l.label} href={l.href} onClick={onClose} className="py-1.5 text-lg text-snow">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
            {t.nav.items.map((l, i) => (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 + i * 0.05 }}
              >
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="block border-b-[0.5px] border-white/10 py-4 text-[22px] tracking-[-.015em]"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <button
            type="button"
            className="cta-btn mt-10 justify-center self-stretch py-5"
            onClick={() => {
              onClose();
              onCta();
            }}
          >
            {t.common.discussProject} <Star size={14} className="cta-star" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
