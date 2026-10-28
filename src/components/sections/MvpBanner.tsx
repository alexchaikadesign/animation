"use client";

import Image from "next/image";
import { useDictionary } from "@/content/I18nProvider";
import { images } from "@/lib/images";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { useContactDrawer } from "@/components/layout/ContactDrawer";

/** MVP-баннер: фон mvp-light.jpg, отступы 30px, степпер этапов с бегущим прогрессом. */
export function MvpBanner() {
  const t = useDictionary().mvp;
  const drawer = useContactDrawer();

  return (
    <div className="bg-white px-[30px] pb-[30px] max-md:px-3 max-md:pb-3">
      <section
        id="mvp"
        className="relative flex flex-col justify-between gap-14 overflow-hidden bg-black px-[max(56px,calc((100vw-1600px)/2+26px))] pt-[72px] pb-16 text-white max-md:px-6 max-md:pt-12 max-md:pb-12"
      >
        <Image src={images["mvp-light"]} alt="" fill sizes="100vw" className="object-cover object-[center_45%]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,0)_40%,rgba(0,0,0,.55)_100%)]" />

        <Reveal className="relative z-[2] flex flex-wrap items-center justify-between gap-6">
          <SectionLabel tone="light" size={14}>
            {t.label}
          </SectionLabel>
        </Reveal>

        <Reveal className="relative z-[2] grid grid-cols-2 items-end gap-14 max-tb:grid-cols-1 max-tb:gap-7">
          <h2 className="m-0 max-w-[560px] text-[50px] leading-[1.05] font-medium tracking-[-.02em] text-pretty text-white max-md:text-[36px]">
            {t.title}
          </h2>
          <div className="flex flex-col items-start gap-[34px]">
            <p className="m-0 max-w-[480px] text-[17px] leading-7 text-pretty text-on-dark-3">{t.text}</p>
            <button
              type="button"
              onClick={() => drawer?.open()}
              className="group inline-flex items-center gap-3.5 border-[0.5px] border-white/24 bg-transparent px-[26px] py-[15px] text-[15px] leading-none font-medium whitespace-nowrap text-white transition-[border-color,background-color] duration-[350ms] hover:border-white/55 hover:bg-white/6"
            >
              {t.cta}
              <span className="inline-block text-lg leading-none font-light transition-transform duration-[450ms] ease-[var(--ease-zoom)] group-hover:rotate-90">
                +
              </span>
            </button>
          </div>
        </Reveal>

        <Reveal className="relative z-[2] mt-6 grid grid-cols-5 gap-0 max-tb:grid-cols-2 max-tb:gap-y-8 max-xs:grid-cols-1">
          <div className="absolute inset-x-0 top-1 h-[0.5px] bg-white/16 max-tb:hidden" />
          <div className="mvp-prog absolute inset-x-0 top-1 h-px origin-left bg-[linear-gradient(90deg,#8a1a06,#c24a0c,#e3a77c)] max-tb:hidden" />
          {t.steps.map((s, i) => (
            <div key={s.title} className="relative flex flex-col gap-3.5 pr-6">
              <span className="mvp-dot size-[9px] rounded-full border border-white/40 bg-night" style={{ animationDelay: `${i * 1.2}s` }} />
              <span className="pt-2.5 text-[13px] leading-none text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-lg leading-[1.2] font-medium tracking-[-.01em] text-white">{s.title}</span>
              <span className="max-w-[260px] text-sm leading-[1.5] text-pretty text-faint">{s.text}</span>
            </div>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
