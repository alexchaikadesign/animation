import Link from "next/link";
import { getDictionary } from "@/content";
import { Star } from "@/components/ui/Star";

/** Светлый хедер внутренних страниц (блог, бриф): знак + «← На главную». */
export function PageHeader({ maxWidth = 1600 }: { maxWidth?: 1440 | 1600 }) {
  const t = getDictionary().common;
  return (
    <header
      className={`mx-auto flex items-center justify-between gap-6 px-14 py-7 max-md:px-5 ${maxWidth === 1440 ? "max-w-[1440px]" : "max-w-[1600px]"}`}
    >
      <Link href="/" className="inline-flex items-center gap-2.5 text-ink">
        <Star size={18} dark priority />
        <span className={`leading-none font-medium tracking-[.01em] ${maxWidth === 1440 ? "text-[17px]" : "text-[19px]"}`}>{t.brand}</span>
      </Link>
      <Link href="/" className="inline-flex items-center gap-2.5 text-[15px] leading-none text-muted transition-colors hover:text-ink">
        {t.backHome}
      </Link>
    </header>
  );
}
