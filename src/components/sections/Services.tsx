"use client";

import { useDictionary } from "@/content/I18nProvider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LeadHeading } from "@/components/ui/LeadHeading";
import { ServiceCard, type ServicePalette } from "./ServiceCard";

/** Услуги: sticky-колонка слева, карточки 2 в ряд. */
export function Services({ palette = "grad" }: { palette?: ServicePalette }) {
  const t = useDictionary().services;

  return (
    <section id="services" className="relative bg-white pt-[130px] pb-[140px] text-ink-2 max-tb:pt-20 max-tb:pb-20">
      <div className="pl-site grid grid-cols-[minmax(420px,1fr)_minmax(0,1.2fr)] items-start gap-px pr-[30px] max-tb:grid-cols-1 max-tb:pr-14 max-md:pr-5">
        <div className="sticky top-14 flex h-[calc(100vh-112px)] flex-col self-start pr-14 max-tb:relative max-tb:top-auto max-tb:mb-12 max-tb:h-auto max-tb:pr-0">
          <SectionLabel className="mb-[26px] flex-none">{t.label}</SectionLabel>
          <LeadHeading
            text={t.title.text}
            muted={t.title.muted}
            className="mb-[34px] max-w-[520px] text-[44px] leading-[1.05] font-medium tracking-[-.02em] break-words text-ink max-md:text-[32px]"
          />
          <p className="m-0 mt-auto max-w-[400px] flex-none text-[17px] leading-7 text-pretty text-muted">{t.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
          {t.items.map((s) => (
            <ServiceCard key={s.title} service={s} palette={palette} />
          ))}
        </div>
      </div>
    </section>
  );
}
