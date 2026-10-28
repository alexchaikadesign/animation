"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { images } from "@/lib/images";
import { useHeroScroll, useMouseParallax } from "@/lib/useHeroScroll";
import { Header } from "@/components/layout/Header";
import { Star } from "@/components/ui/Star";

/** Hero 100vh: фон «включение лампы», параллакс от мыши и при скролле, хедер с мега-меню. */
export function Hero() {
  const t = useDictionary().hero;
  const { innerRef, textRef } = useHeroScroll<HTMLDivElement, HTMLDivElement>();
  const bgRef = useMouseParallax<HTMLDivElement>();
  const [dim, setDim] = useState(false);

  return (
    <div className="relative h-svh overflow-hidden bg-night">
      <div ref={innerRef} className="relative h-svh overflow-hidden will-change-transform">
        <section className="relative flex size-full flex-col overflow-hidden bg-night text-white" aria-label={t.title}>
          {/* фон: «включение лампы» + параллакс от мыши */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div ref={bgRef} className="absolute inset-0 scale-[1.14] will-change-transform">
              <Image src={images["footer-light"]} alt="" fill priority sizes="114vw" className="anim-lamp block object-cover" />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(90%_70%_at_50%_40%,rgba(0,232,154,.08)_0%,rgba(10,14,21,0)_60%)]" />

          {/* затемнение страницы при открытом мега-меню */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] bg-black/55 backdrop-blur-[6px]"
            initial={false}
            animate={{ opacity: dim ? 1 : 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />

          <Header onMegaMenuChange={setDim} />

          {/* заголовок — внизу слева */}
          <div
            ref={textRef}
            className="pointer-events-none absolute top-[150px] right-14 bottom-[7%] left-[90px] z-[3] flex flex-col justify-end will-change-transform max-md:top-auto max-md:right-5 max-md:bottom-10 max-md:left-5"
          >
            <div
              className="anim-rise mb-[18px] inline-flex items-center gap-2.5"
              style={{ animationDuration: ".55s", animationDelay: ".12s" }}
            >
              <Star size={18} priority />
              <span className="text-[clamp(15px,1.4vw,19px)] leading-none font-medium tracking-[.01em] text-snow">{t.label}</span>
            </div>
            <h1
              className="anim-rise m-0 max-w-[min(790px,92%)] text-[clamp(40px,5.6vw,100px)] leading-[0.9] font-medium tracking-[-0.04em] break-words text-white max-md:max-w-full"
              style={{ animationDelay: ".2s" }}
            >
              {t.title}
            </h1>
            <p
              className="anim-rise mt-[34px] mb-0 max-w-[790px] text-[clamp(19px,2.45vw,35px)] leading-[1.24] tracking-[-.015em] text-on-dark max-md:mt-6"
              style={{ animationDelay: ".34s" }}
            >
              {t.subtitle}
            </p>
          </div>

          {/* виньетка сверху/снизу */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(8,11,17,.55)_0%,rgba(8,11,17,0)_18%,rgba(8,11,17,0)_70%,rgba(8,11,17,.55)_84%,rgba(8,11,17,.92)_100%)]" />
        </section>
      </div>
    </div>
  );
}
