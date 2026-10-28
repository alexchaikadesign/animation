"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { images } from "@/lib/images";
import { useViewportProgress } from "@/lib/useViewportProgress";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";

/** «О нас»: лид-заголовок, экспертиза, теги отраслей, бейдж. Блок всплывает со скроллом. */
export function About() {
  const t = useDictionary().about;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const q = useViewportProgress(ref);
  const y = useTransform(q, (v) => 54 - v * 96);
  const opacity = useTransform(q, (v) => Math.min(1, Math.max(0, v / 0.4)));

  return (
    <section id="about" className="relative bg-white pt-[120px] pb-[110px] text-ink-2 max-md:pt-20 max-md:pb-20">
      <motion.div ref={ref} style={reduce ? undefined : { y, opacity }} className="will-change-transform">
        <div className="container-site">
          <div className="grid min-h-[340px] grid-cols-[1fr_1.2fr] items-stretch gap-12 max-tb:min-h-0 max-tb:grid-cols-1 max-tb:gap-8">
            <div className="flex flex-col justify-between">
              <SectionLabel>{t.label}</SectionLabel>
            </div>
            <h2 className="m-0 text-[44px] leading-[1.18] font-medium tracking-[-.02em] text-pretty text-ink max-md:text-[30px]">
              <MaskText text={t.lead.text} /> <MaskText text={t.lead.muted} className="text-[rgb(144,144,144)]" delay={0.18} />
            </h2>
          </div>

          <div id="expertise" className="mt-[70px] mb-[54px] h-px scroll-mt-10 bg-[rgb(10_14_21/0.14)] max-md:mt-12 max-md:mb-10" />

          <div className="grid grid-cols-[0.85fr_1.5fr_auto] items-start gap-14 max-tb:grid-cols-1 max-tb:gap-8">
            <div>
              <h3 className="m-0 mb-[22px] text-[50px] leading-[1.05] font-medium tracking-[-.02em] text-ink max-md:text-[38px]">
                <MaskText text={t.expertise.title} />
              </h3>
              <Reveal y={24}>
                <p className="m-0 max-w-[400px] text-[17px] leading-7 text-muted">{t.expertise.text}</p>
              </Reveal>
            </div>
            <Reveal y={24} delay={0.08}>
              <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
                {t.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-[rgb(10_14_21/0.16)] px-[19px] py-[11px] text-[15px] leading-none font-medium text-ink"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>
            <div className="flex items-start justify-end max-tb:justify-start">
              <Image
                src={images["top-software-developers"]}
                alt={t.badgeAlt}
                sizes="200px"
                className="block h-[58px] w-auto mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
