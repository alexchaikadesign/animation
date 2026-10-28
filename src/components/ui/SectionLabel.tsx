import { Star } from "./Star";

type Props = { children: React.ReactNode; tone?: "dark" | "light"; size?: 14 | 15; className?: string };

/** Лейбл секции: звезда 14–15px + текст 400 15px. */
export function SectionLabel({ children, tone = "dark", size = 15, className = "" }: Props) {
  return (
    <div className={`inline-flex items-center gap-[9px] ${className}`}>
      <Star size={size} dark={tone === "dark"} />
      <span className={`text-[15px] leading-none font-normal ${tone === "dark" ? "text-ink" : "text-snow"}`}>{children}</span>
    </div>
  );
}
