"use client";

import Link from "next/link";
import { useDictionary } from "@/content/I18nProvider";
import { img } from "@/lib/images";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LeadHeading } from "@/components/ui/LeadHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";

/** Проекты: слева sticky-текст, справа кейсы. */
export function Projects() {
  const t = useDictionary().projects;

  return (
    <section id="projects" className="relative bg-surface pt-24 pb-[120px] text-ink-2 max-tb:pt-20 max-tb:pb-0">
      <div className="pl-site grid grid-cols-[minmax(420px,1fr)_minmax(0,1.2fr)] items-start gap-px max-tb:grid-cols-1 max-tb:pr-14 max-md:pr-5">
        <div className="sticky top-14 flex h-[calc(100vh-112px)] flex-col self-start max-tb:static max-tb:mb-12 max-tb:h-auto">
          <SectionLabel className="mb-[26px] flex-none">{t.label}</SectionLabel>
          <LeadHeading
            text={t.title.text}
            muted={t.title.muted}
            className="mb-[34px] max-w-[520px] text-[44px] leading-[1.05] font-medium tracking-[-0.02em] break-words hyphens-auto text-ink max-md:text-[32px]"
          />
          <p className="m-0 mt-auto max-w-[400px] flex-none text-[17px] leading-7 text-pretty text-muted">{t.description}</p>
        </div>

        <div className="-mt-24 -mb-[120px] flex flex-col gap-3.5 self-stretch bg-surface pt-[30px] pr-[30px] pb-[120px] max-tb:m-0 max-tb:p-0 max-tb:pb-20">
          {t.items.map((p, i) => (
            <ProjectCard key={p.id} priority={i === 0} project={{ ...p, image: img(p.image) }} />
          ))}
          <Reveal className="flex justify-center pt-24 pb-10 max-tb:pt-14 max-tb:pb-0">
            <Link
              href={t.more.href}
              className="more-link inline-flex items-baseline gap-2.5 text-2xl leading-[1.05] font-medium tracking-[-.02em] text-ink"
            >
              {t.more.label}
              <span className="more-arrow inline-block size-5 text-xl leading-none">↗</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
