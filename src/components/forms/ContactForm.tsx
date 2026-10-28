"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { images } from "@/lib/images";
import { DEFAULT_COUNTRY } from "@/lib/phone";
import { contactSchema, flattenErrors, validateFiles, type ContactInput } from "@/lib/validation";
import { submitForm } from "@/lib/submit";
import { EASE_OUT } from "@/lib/ease";
import { Star } from "@/components/ui/Star";
import { Doc } from "@/components/ui/Icons";
import { PhoneField, type PhoneValue } from "./PhoneField";
import { FileDrop, FieldError } from "./FileDrop";

type Props = {
  theme: "light" | "dark";
  /** drawer — панель «Заявка» (кнопки внизу); inline — прозрачная форма в подвале. */
  layout: "drawer" | "inline";
};

type Status = "idle" | "sending" | "success" | "error";

const initial: ContactInput = {
  name: "",
  phone: { country: DEFAULT_COUNTRY, number: "" },
  company: "",
  website: "",
  about: "",
  consent: true,
};

/** Форма заявки: ФИО, телефон, компания, сайт, о проекте, файлы, согласие. */
export function ContactForm({ theme, layout }: Props) {
  const t = useDictionary().contactForm;
  const uid = useId();
  const [values, setValues] = useState<ContactInput>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };
  const setPhone = useCallback((p: PhoneValue) => {
    setValues((v) => ({ ...v, phone: p }));
    setErrors(({ phone: _, ...rest }) => rest);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    const fileError = validateFiles(files);
    if (!parsed.success || fileError) {
      const next = parsed.success ? {} : flattenErrors(parsed.error);
      if (fileError) next.files = fileError;
      setErrors(next);
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setStatus("sending");
    const res = await submitForm("/api/contact", parsed.data, files);
    if (res.ok) {
      setStatus("success");
      setValues(initial);
      setFiles([]);
    } else {
      setErrors(res.errors ?? {});
      setStatus("error");
    }
  };

  const err = (key: string) => (errors[key] ? { "aria-invalid": true as const, "aria-describedby": `${uid}-${key}` } : {});
  const dark = theme === "dark";

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className={`flex flex-1 flex-col justify-center py-16 ${dark ? "text-white" : "text-ink"}`}
        role="status"
      >
        <Star size={40} dark={!dark} className="mb-8" />
        <h3 className="m-0 mb-4 text-[34px] leading-[1.1] font-medium tracking-[-.02em]">{t.success.title}</h3>
        <p className={`m-0 max-w-[440px] text-[17px] leading-7 ${dark ? "text-on-dark-2" : "text-muted"}`}>{t.success.text}</p>
      </motion.div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={`${dark ? "theme-dark" : "theme-light"} flex flex-col ${layout === "drawer" ? "min-h-0 flex-1" : "w-full"}`}
    >
      <input
        className="field"
        type="text"
        name="name"
        autoComplete="name"
        placeholder={t.fields.name}
        aria-label={t.fields.name}
        value={values.name}
        onChange={(e) => set("name", e.target.value)}
        {...err("name")}
      />
      {errors.name && <FieldError id={`${uid}-name`}>{errors.name}</FieldError>}

      <PhoneField
        value={values.phone}
        onChange={setPhone}
        theme={theme}
        label={t.fields.phone}
        invalid={!!errors.phone}
        errorId={errors.phone ? `${uid}-phone` : undefined}
      />
      {errors.phone && <FieldError id={`${uid}-phone`}>{errors.phone}</FieldError>}

      <input
        className="field"
        type="text"
        name="company"
        autoComplete="organization"
        placeholder={t.fields.company}
        aria-label={t.fields.company}
        value={values.company}
        onChange={(e) => set("company", e.target.value)}
      />

      <input
        className="field"
        type="url"
        name="website"
        inputMode="url"
        autoComplete="url"
        placeholder={t.fields.website}
        aria-label={t.fields.website}
        value={values.website}
        onChange={(e) => set("website", e.target.value)}
        {...err("website")}
      />
      {errors.website && <FieldError id={`${uid}-website`}>{errors.website}</FieldError>}

      <textarea
        className="field"
        rows={3}
        name="about"
        placeholder={t.fields.about}
        aria-label={t.fields.about}
        value={values.about}
        onChange={(e) => set("about", e.target.value)}
      />

      <FileDrop
        files={files}
        onChange={(f) => (setFiles(f), setErrors(({ files: _, ...r }) => r))}
        text={t.drop.text}
        theme={theme}
        error={errors.files}
      />

      {layout === "drawer" && (
        <Link
          href="/brief"
          className="mt-3 flex items-center justify-center gap-3 border-[0.5px] border-[rgb(18_21_28/0.2)] p-5 text-[15px] leading-none font-medium text-ink transition-colors duration-300 hover:border-ink"
        >
          <Doc />
          {t.brief}
        </Link>
      )}

      <label className={`mt-6 flex cursor-pointer items-center gap-3 text-sm leading-[1.4] ${dark ? "text-on-dark-2" : "text-muted"}`}>
        <input
          type="checkbox"
          className="chk"
          checked={values.consent === true}
          onChange={(e) => set("consent", e.target.checked as true)}
          {...err("consent")}
        />
        <span>
          {t.consent.text}{" "}
          <a href="#" className={`underline underline-offset-[3px] ${dark ? "text-white" : "text-ink"}`}>
            {t.consent.link}
          </a>
        </span>
      </label>
      {errors.consent && <FieldError id={`${uid}-consent`}>{errors.consent}</FieldError>}

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="m-0 mt-4 text-sm text-danger"
          >
            {t.error}
          </motion.p>
        )}
      </AnimatePresence>

      {layout === "drawer" ? (
        <div className="mt-auto flex flex-col gap-3 pt-8">
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex items-center justify-center gap-3 border-0 bg-ink p-[22px] text-base leading-none font-medium text-white transition-opacity duration-300 hover:opacity-88 disabled:opacity-60"
          >
            {status === "sending" ? t.sending : t.submit} <Star size={14} />
          </button>
          <a
            href={t.zoomHref}
            className="flex items-center justify-center gap-3 border-[0.5px] border-[rgb(18_21_28/0.2)] p-5 text-[15px] leading-none font-medium text-ink transition-colors duration-300 hover:border-ink"
          >
            <Image src={images.zoom} alt="Zoom" width={22} height={22} className="block size-[22px] flex-none" />
            {t.zoom}
          </a>
        </div>
      ) : (
        <button type="submit" disabled={status === "sending"} className="cta-btn mt-7 self-start px-[30px] py-4 disabled:opacity-60">
          {status === "sending" ? t.sending : t.submit} <Star size={14} className="cta-star" />
        </button>
      )}
    </form>
  );
}
