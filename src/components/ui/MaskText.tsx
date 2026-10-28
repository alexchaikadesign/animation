"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/ease";

type Props = { text: string; className?: string; delay?: number; stagger?: number };

/**
 * Появление текста из маски: каждое слово выезжает снизу (32px → 0) и проявляется
 * внутри собственного overflow-hidden контейнера.
 */
export function MaskText({ text, className = "", delay = 0, stagger = 0.018 }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(/(\s+)/);
  let i = 0;
  return (
    <motion.span
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {words.map((w, k) => {
        if (/^\s+$/.test(w)) return w;
        const idx = i++;
        return (
          <span key={k} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: 32, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: EASE_OUT, delay: delay + idx * stagger } },
              }}
            >
              {w}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}
