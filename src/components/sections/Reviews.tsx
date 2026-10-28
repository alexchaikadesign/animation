"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { img } from "@/lib/images";
import { EASE_OUT } from "@/lib/ease";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Star } from "@/components/ui/Star";
import { ChevronSide } from "@/components/ui/Icons";

/** Отзывы: логотип и описание клиента слева, белая карточка с фото, именем, цитатой. */
export function Reviews() {
  const t = useDictionary().reviews;
  const [index, setIndex] = useState(0);
  const n = t.items.length;
  const r = t.items[((index % n) + n) % n];

  return (
    <section id="reviews" className="relative bg-surface pt-[130px] pb-[140px] text-ink max-tb:py-20">
      <div className="container-site">
        <div className="mb-[72px] flex items-end justify-between gap-8 max-md:mb-10">
          <div>
            <SectionLabel size={14} className="mb-[26px]">
              {t.label}
            </SectionLabel>
            <h2 className="m-0 text-[50px] leading-[1.05] font-medium tracking-[-.02em] text-pretty text-ink max-md:text-[36px]">
              {t.title}
            </h2>
          </div>
          <div className="flex flex-none gap-2">
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={dir === "left" ? t.prev : t.next}
                onClick={() => setIndex((v) => v + (dir === "left" ? -1 : 1))}
                className="flex size-14 items-center justify-center rounded-full border-0 bg-white text-ink transition-colors duration-300 hover:bg-[#ececec] max-md:size-12"
              >
                <ChevronSide dir={dir} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid" aria-live="polite">
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className="col-start-1 row-start-1 grid grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] items-start gap-20 max-[1000px]:grid-cols-1 max-[1000px]:gap-8"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ opacity: { duration: 0.6 }, y: { duration: 0.7, ease: EASE_OUT } }}
            >
              <div className="flex flex-col gap-7 pt-2">
                <Image src={img(r.logo)} alt="" sizes="150px" className="block h-auto w-[150px] mix-blend-multiply" />
                <p className="m-0 max-w-[400px] text-[17px] leading-7 text-pretty text-muted">{r.about}</p>
              </div>
              <figure className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-12 bg-white px-14 py-12 max-[1000px]:grid-cols-1 max-[1000px]:gap-7 max-[1000px]:p-8 max-md:p-6">
                <figcaption className="flex min-w-[150px] flex-col gap-1.5">
                  <Image
                    src={img(r.avatar)}
                    alt={r.name}
                    sizes="104px"
                    className="mb-[18px] block size-[104px] rounded-full object-cover"
                  />
                  <span className="text-[19px] leading-[1.3] font-medium tracking-[-.01em] text-ink">{r.name}</span>
                  <span className="text-[15px] leading-[1.4] text-muted">{r.role}</span>
                </figcaption>
                <blockquote className="m-0 flex items-start gap-[22px]">
                  <Star size={26} dark className="mt-0.5" />
                  <p className="m-0 text-[19px] leading-[1.6] tracking-[-.005em] text-pretty text-ink max-md:text-[17px]">{r.quote}</p>
                </blockquote>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
