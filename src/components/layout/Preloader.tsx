"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "@/lib/ease";
import { Star } from "@/components/ui/Star";

/**
 * Прелоадер: звезда 52px вращается и пульсирует на тёмном фоне, затем fade-out.
 * Уходит через 500мс после window.load (900мс, если страница уже загружена), но не позже 1.5с.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    const timers = [setTimeout(hide, 1500)];
    const onLoad = () => timers.push(setTimeout(hide, 500));
    if (document.readyState === "complete") timers.push(setTimeout(hide, 900));
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-night"
          exit={{ opacity: 0, scale: 1.04, pointerEvents: "none" }}
          transition={{ opacity: { duration: 0.85, ease: EASE_OUT }, scale: { duration: 0.9, ease: EASE_OUT } }}
          aria-hidden
        >
          <Star size={52} priority className="loader-star" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
