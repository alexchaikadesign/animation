"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { EASE_ZOOM } from "@/lib/ease";
import { Close } from "@/components/ui/Icons";
import { ContactForm } from "@/components/forms/ContactForm";

type Ctx = { open: () => void; close: () => void; isOpen: boolean };
const DrawerContext = createContext<Ctx | null>(null);

/** Открыть панель «Заявка» из любого CTA. */
export function useContactDrawer() {
  return useContext(DrawerContext);
}

export function ContactDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <DrawerContext.Provider value={value}>
      {children}
      <ContactDrawer open={isOpen} onClose={close} />
    </DrawerContext.Provider>
  );
}

function ContactDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dict = useDictionary();
  const t = dict.contactForm;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label={t.drawerTitle}>
          <motion.div
            className="absolute inset-0 bg-[rgb(7_9_13/0.5)] backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
          />
          <motion.aside
            className="theme-light absolute inset-y-0 right-0 flex w-[min(560px,100vw)] flex-col overflow-y-auto bg-white px-14 pt-12 pb-10 text-ink shadow-[-40px_0_80px_rgba(0,0,0,.35)] max-sm:px-6 max-sm:pt-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: EASE_ZOOM }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[26px] leading-none font-medium tracking-[-.02em]">{t.drawerTitle}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label={dict.common.close}
                autoFocus
                className="-mr-3 flex size-11 items-center justify-center border-0 bg-transparent text-ink transition-transform duration-[400ms] ease-[var(--ease-zoom)] hover:rotate-90"
              >
                <Close />
              </button>
            </div>
            <ContactForm theme="light" layout="drawer" />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
