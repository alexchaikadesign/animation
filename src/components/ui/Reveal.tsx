"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { EASE_OUT } from "@/lib/ease";

type Props = HTMLMotionProps<"div"> & { as?: "div" | "article" | "p" | "li"; delay?: number; y?: number };

/**
 * Reveal при скролле: translateY 56px → 0, opacity 0 → 1 (.9s/1s, easeOut).
 * Срабатывает, когда верх элемента пересекает 88% высоты экрана — как в прототипе.
 */
export function Reveal({ as = "div", delay = 0, y = 56, children, ...rest }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ opacity: { duration: 0.9, ease: EASE_OUT, delay }, y: { duration: 1, ease: EASE_OUT, delay } }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
