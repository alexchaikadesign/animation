"use client";

import { useEffect, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

/**
 * Несжатый прогресс элемента относительно вьюпорта: q = (vh − top) / vh.
 * 0 — верх элемента у нижней кромки экрана, 1 — у верхней (продолжает расти дальше).
 */
export function useViewportProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const q = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const h = window.innerHeight || 800;
      q.set((h - el.getBoundingClientRect().top) / h);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [ref, q]);
  return q;
}
