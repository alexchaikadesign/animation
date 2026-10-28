"use client";

import { useDictionary } from "@/content/I18nProvider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LeadHeading } from "@/components/ui/LeadHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";

/** Отрасли — вариант «Список»: строки с номером, названием, описанием; hover — линия и стрелка. */
export function Industries() {
  const t = useDictionary().industries;

  return (
    <section id="industries" className="relative bg-white py-[140px] text-ink max-tb:py-20">
      <div className="container-site">
        <div className="mb-[90px] grid grid-cols-2 items-end gap-14 max-tb:mb-14 max-tb:grid-cols-1 max-tb:gap-7">
          <Reveal>
            <SectionLabel className="mb-[26px]">{t.label}</SectionLabel>
            <LeadHeading
              text={t.title.text}
              muted={t.title.muted}
              className="max-w-[520px] text-[44px] leading-[1.05] font-medium tracking-[-.02em] break-words text-ink max-md:text-[32px]"
            />
          </Reveal>
          <Reveal as="p" className="m-0 max-w-[400px] text-[17px] leading-7 text-pretty text-muted">
            {t.description}
          </Reveal>
        </div>

        <div className="hairline-b">
          {t.items.map((it, i) => (
            <Reveal
              key={it.title}
              className="ind-row hairline-t relative grid cursor-default grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)_44px] items-start gap-8 py-[34px] max-tb:grid-cols-[44px_minmax(0,1fr)_28px] max-tb:gap-x-[18px] max-tb:gap-y-3 max-tb:px-4 max-tb:py-[26px] max-md:px-0"
            >
              <span className="relative z-[1] text-[15px] leading-[1.6] text-faint-2">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="ind-t relative z-[1] m-0 text-2xl leading-[1.25] font-medium tracking-[-.02em] text-pretty text-ink max-md:text-xl">
                {it.title}
              </h3>
              <p className="relative z-[1] m-0 max-w-[400px] text-[17px] leading-7 text-pretty text-muted max-tb:col-[2/4]">{it.text}</p>
              <ArrowUpRight className="ind-a relative z-[1] mt-1.5 justify-self-end text-ink max-tb:col-[3] max-tb:row-[1]" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
