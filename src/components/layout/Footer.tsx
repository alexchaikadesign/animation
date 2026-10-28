"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { icons, images } from "@/lib/images";
import { EASE_OUT } from "@/lib/ease";
import { Doc, ArrowUpRight } from "@/components/ui/Icons";
import { ContactForm } from "@/components/forms/ContactForm";
import { useContactDrawer } from "./ContactDrawer";

/* Анимации появления подвала (faUp / faPop / faWord), шаг задержки 0.12s */
const up: Variants = {
  hidden: { opacity: 0, y: 64 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 1.15, ease: EASE_OUT, delay: d * 0.12 } }),
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.55 },
  show: (d = 0) => ({ opacity: 1, scale: 1, transition: { duration: 1.1, ease: EASE_OUT, delay: d * 0.12 } }),
};
const word: Variants = {
  hidden: { opacity: 0, y: "45%" },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 1.6, ease: EASE_OUT, delay: d * 0.12 } }),
};

type Props = {
  /** drawer — главная: CTA-кнопка открывает панель «Заявка»; inline — блог: прозрачная форма в подвале. */
  variant?: "drawer" | "inline";
};

/** Подвал: призыв, контакты, навигация, услуги, рассылка, крупный логотип. */
export function Footer({ variant = "drawer" }: Props) {
  const t = useDictionary();
  const f = t.footer;
  const drawer = useContactDrawer();

  return (
    <motion.footer
      id="contacts"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      className="relative overflow-hidden bg-black-soft text-white"
    >
      <Image src={images["footer-light"]} alt="" fill sizes="100vw" className="pointer-events-none z-0 object-cover object-[center_40%]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(7,9,13,.55)_0%,rgba(7,9,13,.35)_45%,rgba(7,9,13,.6)_100%)]"
      />

      <div className="container-site relative z-[1] pt-[110px] pb-10 max-md:pt-20">
        {variant === "drawer" ? (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-14 pt-10 pb-6 max-tb:grid-cols-1 max-tb:gap-14">
            <div>
              <motion.h2
                variants={up}
                className="m-0 max-w-[820px] text-[clamp(52px,7.2vw,112px)] leading-[.95] font-normal tracking-[-.045em] text-balance text-white"
              >
                {f.title[0]}
                <br />
                {f.title[1]}
              </motion.h2>
              <motion.p variants={up} custom={1} className="m-0 mt-[30px] max-w-[440px] text-xl leading-8 text-pretty text-on-dark-2">
                {f.subtitle}
              </motion.p>
            </div>
            <motion.button
              variants={pop}
              custom={2}
              type="button"
              onClick={() => drawer?.open()}
              whileHover={{ scale: 1.06, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
              className="ft-start flex size-[200px] flex-col items-center justify-center gap-3 rounded-full border-0 bg-white text-[17px] leading-none font-medium text-black-soft max-md:size-40"
            >
              <ArrowUpRight size={28} strokeWidth={1.3} className="ft-start-ar" />
              <span className="text-center leading-[1.25]">
                {f.startButton[0]}
                <br />
                {f.startButton[1]}
              </span>
            </motion.button>
          </div>
        ) : (
          <motion.div
            variants={up}
            className="grid grid-cols-2 items-stretch gap-20 bg-[linear-gradient(160deg,rgba(255,255,255,.07)_0%,rgba(255,255,255,.02)_55%,rgba(255,255,255,.04)_100%)] p-14 backdrop-blur-[24px] backdrop-saturate-[1.3] max-tb:grid-cols-1 max-tb:gap-14 max-md:p-6"
          >
            <div className="flex flex-col gap-11">
              <h2 className="m-0 max-w-[820px] text-[clamp(52px,6.8vw,104px)] leading-none font-normal tracking-[-.04em] text-balance text-white max-md:text-[44px]">
                {f.title.join(" ")}
              </h2>
              <p className="-mt-4 mb-0 max-w-[440px] text-xl leading-8 text-pretty text-on-dark-2">{f.subtitle}</p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={t.contactForm.zoomHref}
                  className="inline-flex items-center gap-2.5 bg-white px-7 py-[18px] text-[15px] leading-none font-medium text-black-soft transition-opacity duration-300 hover:opacity-85"
                >
                  <Image src={images.zoom} alt="Zoom" width={22} height={22} className="block size-[22px] flex-none" />
                  {t.contactForm.zoom}
                </a>
                <Link
                  href="/brief"
                  className="inline-flex items-center gap-3 border-[0.5px] border-white/30 px-7 py-[17px] text-[15px] leading-none font-medium text-white transition-colors duration-300 hover:border-white"
                >
                  <Doc />
                  {t.contactForm.brief}
                </Link>
              </div>
            </div>
            <div className="-mt-[22px] w-full max-w-[680px] justify-self-end max-tb:mt-0">
              <ContactForm theme="dark" layout="inline" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="h-4" />
      <div aria-hidden className="container-site pointer-events-none relative z-[1] mb-[calc(-1*clamp(70px,8.5vw,140px))]">
        <motion.div variants={word} custom={2}>
          <Image src={icons.logo} alt="" width={140} height={34} unoptimized className="block h-auto w-full" />
        </motion.div>
      </div>

      <div className="relative z-[2] border-t-[0.5px] border-white/12 bg-[linear-gradient(180deg,rgba(7,9,13,.25)_0%,rgba(7,9,13,.7)_45%,rgba(7,9,13,.92)_100%)] backdrop-blur-[36px] backdrop-saturate-[1.2]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-4 border-l-[0.5px] border-white/10 max-tb:grid-cols-2 max-sm:grid-cols-1 max-sm:border-l-0">
          <FooterCol delay={3}>
            <ColTitle>{f.contacts.title}</ColTitle>
            <div className="flex flex-col gap-7">
              <ContactItem label={f.contacts.emailLabel}>
                <a
                  href={`mailto:${f.contacts.email}`}
                  className="ft-link text-[22px] leading-[1.25] tracking-[-.01em] text-white underline decoration-1 underline-offset-4"
                >
                  {f.contacts.email}
                </a>
              </ContactItem>
              <ContactItem label={f.contacts.phoneLabel}>
                <a
                  href={f.contacts.phoneHref}
                  className="ft-link text-[22px] leading-[1.25] tracking-[-.01em] whitespace-nowrap text-white"
                >
                  {f.contacts.phone}
                </a>
              </ContactItem>
              <ContactItem label={f.contacts.geoLabel}>
                <span className="text-[22px] leading-[1.25] tracking-[-.01em] text-white">{f.contacts.geo}</span>
                <span className="mt-1.5 text-[15px] leading-[1.4] text-faint">{f.contacts.office}</span>
              </ContactItem>
            </div>
            <div className="mt-auto flex gap-2.5 pt-9">
              {f.contacts.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-11 items-center justify-center rounded-full border-[0.5px] border-white/20 transition-[background-color,border-color] duration-300 hover:border-white/50 hover:bg-white/8"
                >
                  <Image src={s.icon} alt="" width={18} height={18} unoptimized className="block size-[18px] brightness-0 invert" />
                </a>
              ))}
            </div>
          </FooterCol>

          <FooterCol delay={4}>
            <ColTitle>{f.navigation.title}</ColTitle>
            <LinkList links={f.navigation.links} />
          </FooterCol>

          <FooterCol delay={5}>
            <ColTitle>{f.services.title}</ColTitle>
            <LinkList links={f.services.links} />
          </FooterCol>

          <FooterCol delay={6}>
            <ColTitle>{f.newsletter.title}</ColTitle>
            <span className="max-w-[280px] text-base leading-[1.5] text-snow">{f.newsletter.text}</span>
            <Newsletter />
          </FooterCol>
        </div>
        <div className="mx-auto flex max-w-[1600px] flex-wrap justify-between gap-5 border-t-[0.5px] border-white/10 px-8 py-[26px] text-sm leading-none text-faint max-md:px-5">
          <span>{f.copyright}</span>
          <a href={f.privacy.href} className="ft-link text-faint">
            {f.privacy.label}
          </a>
        </div>
      </div>
    </motion.footer>
  );
}

function FooterCol({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <div className="border-r-[0.5px] border-white/10 px-8 pt-14 pb-16 max-sm:border-r-0 max-sm:border-b-[0.5px] max-sm:px-5 max-sm:pt-10 max-sm:pb-10">
      <motion.div variants={up} custom={delay} className="flex h-full flex-col gap-[22px]">
        {children}
      </motion.div>
    </div>
  );
}

function ColTitle({ children }: { children: React.ReactNode }) {
  return <span className="text-xs leading-none tracking-[.1em] text-faint uppercase">{children}</span>;
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] leading-none text-faint">{label}</span>
      {children}
    </div>
  );
}

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="ft-link text-base leading-[1.3] text-snow">
          {l.label}
        </Link>
      ))}
    </div>
  );
}

function Newsletter() {
  const t = useDictionary();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "invalid" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setState("invalid");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setState(res?.ok ? "done" : "invalid");
  };

  if (state === "done") return <span className="text-[15px] text-white">{t.footer.newsletter.success}</span>;

  return (
    <form onSubmit={submit} noValidate>
      <label
        className={`flex h-14 items-center gap-3 rounded-full border-[0.5px] pr-1.5 pl-[22px] transition-colors ${state === "invalid" ? "border-danger" : "border-white/30 focus-within:border-white/70"}`}
      >
        <input
          type="email"
          autoComplete="email"
          aria-label={t.footer.newsletter.placeholder}
          aria-invalid={state === "invalid" || undefined}
          placeholder={t.footer.newsletter.placeholder}
          value={email}
          onChange={(e) => (setEmail(e.target.value), setState("idle"))}
          className="min-w-0 flex-1 border-0 bg-transparent text-[15px] leading-none text-white outline-none"
        />
        <button
          type="submit"
          aria-label={t.footer.newsletter.submit}
          className="flex size-11 flex-none items-center justify-center rounded-full border-0 bg-white text-black-soft transition-transform duration-300 hover:scale-105"
        >
          <ArrowUpRight size={16} strokeWidth={1.6} />
        </button>
      </label>
      {state === "invalid" && <p className="m-0 mt-2 text-[13px] text-danger">{t.validation.email}</p>}
    </form>
  );
}
