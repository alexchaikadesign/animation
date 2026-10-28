import Image from "next/image";
import { images } from "@/lib/images";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowSquare } from "@/components/ui/Icons";

/** Тонкие пиктограммы услуг (stroke 1, pathLength=1 для прорисовки на hover). */
const ICONS: Record<string, React.ReactNode> = {
  webApps: (
    <>
      <rect pathLength={1} x="3" y="4" width="18" height="16" rx="2" />
      <path pathLength={1} d="M3 9h18M9 9v11" />
    </>
  ),
  sites: (
    <>
      <rect pathLength={1} x="3" y="5" width="18" height="12" rx="2" />
      <path pathLength={1} d="M9 21h6M12 17v4" />
    </>
  ),
  mobile: (
    <>
      <rect pathLength={1} x="7" y="3" width="10" height="18" rx="2.5" />
      <path pathLength={1} d="M11 18h2" />
    </>
  ),
  shops: (
    <>
      <path pathLength={1} d="M5 8h14l-1.2 12H6.2L5 8Z" />
      <path pathLength={1} d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  web3: (
    <>
      <path pathLength={1} d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path pathLength={1} d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  uiux: (
    <>
      <path pathLength={1} d="M12 3l9 5-9 5-9-5 9-5Z" />
      <path pathLength={1} d="M3 13l9 5 9-5" />
    </>
  ),
  branding: <path pathLength={1} d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" />,
  marketing: (
    <>
      <path pathLength={1} d="M3 18l6-6 4 4 8-8" />
      <path pathLength={1} d="M15 8h6v6" />
    </>
  ),
  ai: <path pathLength={1} d="M12 3l2.2 6.3L20.5 12l-6.3 2.2L12 20.5l-2.2-6.3L3.5 12l6.3-2.2L12 3Z" />,
  consulting: (
    <>
      <circle pathLength={1} cx="12" cy="12" r="9" />
      <path pathLength={1} d="M15.5 8.5l-2 5.5-5.5 2 2-5.5 5.5-2Z" />
    </>
  ),
};

export type Service = { icon: string; title: string; text: string; details: string; tags: string[] };
export type ServicePalette = "grad" | "cool";

/**
 * Карточка услуги. `grad` (по README): фон #F4F4F2 + обводка 1.5px из hero-изображения на hover;
 * `cool` (вариант прототипа): фон #F1F2F5.
 */
export function ServiceCard({ service, palette = "grad" }: { service: Service; palette?: ServicePalette }) {
  return (
    <Reveal className="h-full">
      <article
        className={`svc-card h-full flex min-h-[440px] cursor-pointer flex-col justify-between gap-[34px] px-[34px] pt-[30px] pb-8 max-md:min-h-0 max-md:px-6 max-md:pt-6 max-md:pb-7 ${palette === "grad" ? "bg-card" : "bg-card-cool"}`}
      >
        {palette === "grad" ? (
          <span className="svc-border" aria-hidden>
            <Image src={images["footer-light"]} alt="" fill sizes="40vw" className="object-cover object-[30%_45%]" />
          </span>
        ) : null}
        <div className="flex items-start justify-between gap-[18px] text-ink">
          <svg
            className="svc-ico block"
            viewBox="0 0 24 24"
            width="34"
            height="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {ICONS[service.icon]}
          </svg>
          <ArrowSquare size={22} strokeWidth={1.2} className="svc-arr" />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="m-0 text-[25px] leading-[1.22] font-normal tracking-[-.02em] text-pretty text-ink max-md:text-[22px]">
            {service.title}
          </h3>
          <p className="m-0 text-base leading-[1.6] text-pretty text-body">{service.text}</p>
          <p className="m-0 text-[13px] leading-[1.6] text-pretty text-faint">{service.details}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="svc-chip rounded-full border-[0.5px] border-[rgb(18_21_28/0.18)] px-[13px] py-1.5 text-xs leading-none whitespace-nowrap text-muted-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
