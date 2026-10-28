"use client";

import { useEffect, useRef } from "react";

/**
 * Скролл-параллакс hero (как onScroll прототипа):
 * обёртка уезжает со скоростью 0.45, текст — навстречу (-0.5) и гаснет к 75% высоты экрана.
 */
export function useHeroScroll<A extends HTMLElement, B extends HTMLElement>() {
  const inner = useRef<A>(null);
  const text = useRef<B>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const innerEl = inner.current;
    const textEl = text.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight || 800;
      const y = Math.min(window.scrollY, h);
      if (innerEl) innerEl.style.transform = `translate3d(0,${(y * 0.45).toFixed(1)}px,0)`;
      if (textEl) {
        textEl.style.transform = `translate3d(0,${(-y * 0.5).toFixed(1)}px,0)`;
        textEl.style.opacity = String(Math.max(0, 1 - y / (h * 0.75)));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return { innerRef: inner, textRef: text };
}

/** Параллакс фона от мыши: scale(1.14) + сдвиг до ±26/±20px с плавным догоном (lerp 0.055). */
export function useMouseParallax<T extends HTMLElement>() {
  const el = useRef<T>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = el.current;
    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const loop = () => {
      cx += (mx - cx) * 0.055;
      cy += (my - cy) * 0.055;
      if (node) node.style.transform = `scale(1.14) translate3d(${(-cx * 26).toFixed(2)}px,${(-cy * 20).toFixed(2)}px,0)`;
      raf = Math.abs(mx - cx) + Math.abs(my - cy) > 0.0005 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf && window.scrollY < window.innerHeight) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  return el;
}
