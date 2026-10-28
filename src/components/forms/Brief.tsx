"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionary } from "@/content/I18nProvider";
import { DEFAULT_COUNTRY } from "@/lib/phone";
import { briefSchema, briefStepFields, flattenErrors, validateFiles, type BriefInput } from "@/lib/validation";
import { submitForm } from "@/lib/submit";
import { EASE_OUT } from "@/lib/ease";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Star } from "@/components/ui/Star";
import { PhoneField, type PhoneValue } from "./PhoneField";
import { FileDrop, FieldError } from "./FileDrop";

type ListKey = "services" | "stages" | "industries" | "terms" | "budgets" | "channels";
const MULTI: Record<ListKey, boolean> = { services: true, industries: true, stages: false, terms: false, budgets: false, channels: false };

const initial: BriefInput = {
  services: [],
  stages: [],
  industries: [],
  idea: "",
  goals: "",
  audience: "",
  website: "",
  competitors: "",
  references: "",
  terms: [],
  budgets: [],
  name: "",
  phone: { country: DEFAULT_COUNTRY, number: "" },
  email: "",
  company: "",
  channels: ["Telegram"],
  consent: true,
};

const TOTAL = 5;

/** Многошаговый онлайн-бриф: 5 шагов + экран «Спасибо», прогресс, валидация по шагам. */
export function Brief() {
  const t = useDictionary().brief;
  const v = useDictionary().contactForm;
  const uid = useId();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<BriefInput>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const done = step === TOTAL;

  const set = <K extends keyof BriefInput>(key: K, value: BriefInput[K]) => {
    setValues((s) => ({ ...s, [key]: value }));
    setErrors(({ [key]: _, ...rest }) => rest);
  };
  const setPhone = useCallback((p: PhoneValue) => {
    setValues((s) => ({ ...s, phone: p }));
    setErrors(({ phone: _, ...rest }) => rest);
  }, []);

  const toggle = (key: ListKey, label: string) => {
    const cur = values[key] ?? [];
    const next = MULTI[key] ? (cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]) : cur.includes(label) ? [] : [label];
    set(key, next);
  };

  /** Ошибки только по полям указанного шага. */
  const stepErrors = (s: number) => {
    const res = briefSchema.safeParse(values);
    const all = res.success ? {} : flattenErrors(res.error);
    const out: Record<string, string> = {};
    for (const f of briefStepFields[s] ?? []) if (all[f]) out[f] = all[f];
    if (s === 2) {
      const fe = validateFiles(files);
      if (fe) out.files = fe;
    }
    return out;
  };

  const go = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Переход вперёд проверяет все промежуточные шаги; назад — свободно. */
  const goTo = (target: number) => {
    for (let s = step; s < target; s++) {
      const e = stepErrors(s);
      if (Object.keys(e).length) {
        setErrors(e);
        if (s !== step) go(s);
        return false;
      }
    }
    setErrors({});
    go(target);
    return true;
  };

  const next = async () => {
    if (step < TOTAL - 1) return void goTo(step + 1);
    const e = stepErrors(step);
    if (Object.keys(e).length) return setErrors(e);
    const parsed = briefSchema.safeParse(values);
    if (!parsed.success) {
      // ошибка на одном из прошлых шагов — вернуть туда
      const all = flattenErrors(parsed.error);
      const bad = briefStepFields.findIndex((fs) => fs.some((f) => all[f]));
      setErrors(all);
      if (bad >= 0) go(bad);
      return;
    }
    setStatus("sending");
    const res = await submitForm("/api/brief", parsed.data, files);
    if (res.ok) {
      setStatus("idle");
      go(TOTAL);
    } else {
      setErrors(res.errors ?? {});
      setStatus("error");
    }
  };

  const err = (key: string) => (errors[key] ? { "aria-invalid": true as const, "aria-describedby": `${uid}-${key}` } : {});
  const errEl = (k: string) => (errors[k] ? <FieldError id={`${uid}-${k}`}>{errors[k]}</FieldError> : null);

  const chips = (k: ListKey, size: "md" | "sm" | "tile" = "md") => (
    <div className={size === "tile" ? "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2" : "flex flex-wrap gap-2"}>
      {t.options[k].map((label) => {
        const on = (values[k] ?? []).includes(label);
        return (
          <button
            key={label}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(k, label)}
            className={`border-[0.5px] transition-[background-color,color,border-color] duration-300 ${on ? "border-ink bg-ink text-white" : "border-[rgb(18_21_28/0.16)] bg-white text-ink hover:border-[rgb(18_21_28/0.4)]"} ${
              size === "sm"
                ? "px-4 py-[11px] text-sm leading-none"
                : size === "tile"
                  ? "p-5 text-left text-base leading-none"
                  : "px-5 py-[13px] text-[15px] leading-none"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  const field = ({ k, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { k: keyof BriefInput }) => {
    return (
      <input
        key={k}
        className="field pt-6 pb-[18px]"
        aria-label={rest.placeholder}
        value={(values[k] as string) ?? ""}
        onChange={(e) => set(k, e.target.value as never)}
        {...err(k)}
        {...rest}
      />
    );
  };

  const title = (n: number, text: string, hint?: string) => (
    <>
      <span className="text-[13px] leading-none tracking-[.1em] text-muted uppercase">{t.stepOf(n, TOTAL)}</span>
      <h2 className={`mt-4 text-[34px] leading-[1.15] font-medium tracking-[-.02em] max-md:text-[28px] ${hint ? "mb-2.5" : "mb-9"}`}>
        {text}
      </h2>
      {hint ? <p className="m-0 mb-9 text-[17px] leading-7 text-muted">{hint}</p> : null}
    </>
  );

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,420px)_minmax(0,1fr)] items-start gap-20 px-14 pt-14 pb-[120px] max-tb:grid-cols-1 max-tb:gap-12 max-md:px-5 max-md:pt-8 max-md:pb-16">
      <aside className="sticky top-10 max-tb:static">
        <SectionLabel size={14} className="mb-[26px]">
          {t.label}
        </SectionLabel>
        <h1 className="m-0 mb-[22px] text-[50px] leading-[1.05] font-medium tracking-[-.02em] text-pretty text-ink max-md:text-[38px]">
          {t.title}
        </h1>
        <p className="m-0 mb-12 max-w-[400px] text-[17px] leading-7 text-pretty text-muted">{t.text}</p>
        <ol className="m-0 flex list-none flex-col border-t-[0.5px] border-[rgb(18_21_28/0.12)] p-0 max-tb:hidden">
          {t.steps.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                disabled={done}
                aria-current={i === step ? "step" : undefined}
                onClick={() => (i < step ? (setErrors({}), go(i)) : goTo(i))}
                className={`flex w-full items-center gap-[18px] border-0 border-b-[0.5px] border-[rgb(18_21_28/0.12)] bg-transparent py-[18px] text-left text-base leading-none transition-colors duration-300 ${i === step ? "text-ink" : "text-faint-2 hover:text-ink"}`}
              >
                <span className="w-7 text-[13px] font-medium tracking-[.04em]">0{i + 1}</span>
                <span className="flex-1">{label}</span>
                <span className="text-sm leading-none transition-opacity" style={{ opacity: i < step ? 1 : 0 }}>
                  ✓
                </span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <main className="theme-light min-w-0 bg-white px-[clamp(28px,4vw,64px)] pt-14 pb-12 max-md:px-5 max-md:pt-8">
        <div
          className="mb-12 h-0.5 overflow-hidden bg-[rgb(18_21_28/0.08)]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL}
          aria-valuenow={Math.min(step + 1, TOTAL)}
        >
          <div
            className="h-full bg-ink transition-[width] duration-[600ms] ease-[var(--ease-out-expo)]"
            style={{ width: `${(Math.min(TOTAL, step + 1) / TOTAL) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            {step === 0 && (
              <>
                {title(1, t.s0.title, t.s0.hint)}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5">
                  {t.options.services.map((label) => {
                    const on = values.services.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle("services", label)}
                        className={`flex items-center justify-between gap-3.5 border-[0.5px] bg-white p-[22px] text-left text-base leading-[1.3] text-ink transition-colors duration-300 ${on ? "border-ink" : "border-[rgb(18_21_28/0.16)] hover:border-[rgb(18_21_28/0.4)]"}`}
                      >
                        <span>{label}</span>
                        <span
                          className={`flex size-5 flex-none items-center justify-center rounded-full border transition-colors duration-300 ${on ? "border-ink" : "border-[rgb(18_21_28/0.3)]"}`}
                        >
                          <span
                            className="size-2.5 rounded-full bg-ink transition-transform duration-[350ms] ease-[var(--ease-out-expo)]"
                            style={{ transform: `scale(${on ? 1 : 0})` }}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errEl("services")}
              </>
            )}

            {step === 1 && (
              <>
                {title(2, t.s1.title)}
                <div className="mb-4 text-[15px] leading-none font-medium">{t.s1.stage}</div>
                <div className="mb-10">{chips("stages")}</div>
                <div className="mb-4 text-[15px] leading-none font-medium">{t.s1.industry}</div>
                <div className="mb-7">{chips("industries", "sm")}</div>
                <textarea
                  className="field pt-6 pb-[18px] leading-[1.5]"
                  rows={3}
                  placeholder={t.s1.idea}
                  aria-label={t.s1.idea}
                  value={values.idea}
                  onChange={(e) => set("idea", e.target.value)}
                />
                {field({ k: "goals", type: "text", placeholder: t.s1.goals })}
              </>
            )}

            {step === 2 && (
              <>
                {title(3, t.s2.title, t.s2.hint)}
                <div className="-mt-4">
                  {field({ k: "audience", type: "text", placeholder: t.s2.audience })}
                  {field({ k: "website", type: "url", inputMode: "url", placeholder: t.s2.website })}
                  {errEl("website")}
                  {field({ k: "competitors", type: "text", placeholder: t.s2.competitors })}
                  <textarea
                    className="field pt-6 pb-[18px] leading-[1.5]"
                    rows={2}
                    placeholder={t.s2.references}
                    aria-label={t.s2.references}
                    value={values.references}
                    onChange={(e) => set("references", e.target.value)}
                  />
                  <div className="mt-1.5">
                    <FileDrop
                      files={files}
                      onChange={(f) => (setFiles(f), setErrors(({ files: _, ...r }) => r))}
                      text={t.s2.drop}
                      error={errors.files}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {title(4, t.s3.title)}
                <div className="mb-4 text-[15px] leading-none font-medium">{t.s3.term}</div>
                <div className="mb-10">{chips("terms")}</div>
                <div className="mb-4 text-[15px] leading-none font-medium">{t.s3.budget}</div>
                {chips("budgets", "tile")}
              </>
            )}

            {step === 4 && (
              <>
                <span className="text-[13px] leading-none tracking-[.1em] text-muted uppercase">{t.stepOf(5, TOTAL)}</span>
                <h2 className="mt-4 mb-5 text-[34px] leading-[1.15] font-medium tracking-[-.02em] max-md:text-[28px]">{t.s4.title}</h2>
                {field({ k: "name", type: "text", autoComplete: "name", placeholder: v.fields.name })}
                {errEl("name")}
                <PhoneField
                  value={values.phone}
                  onChange={setPhone}
                  theme="light"
                  label={v.fields.phone}
                  invalid={!!errors.phone}
                  errorId={errors.phone ? `${uid}-phone` : undefined}
                />
                {errEl("phone")}
                {field({ k: "email", type: "email", autoComplete: "email", placeholder: t.s4.email })}
                {errEl("email")}
                {field({ k: "company", type: "text", autoComplete: "organization", placeholder: v.fields.company })}
                <div className="mt-9 mb-4 text-[15px] leading-none font-medium">{t.s4.channel}</div>
                {chips("channels")}
                <label className="mt-8 flex cursor-pointer items-center gap-3 text-sm leading-[1.4] text-muted">
                  <input
                    type="checkbox"
                    className="chk"
                    checked={values.consent === true}
                    onChange={(e) => set("consent", e.target.checked as true)}
                    {...err("consent")}
                  />
                  <span>
                    {v.consent.text}{" "}
                    <a href="#" className="text-ink underline underline-offset-[3px]">
                      {v.consent.link}
                    </a>
                  </span>
                </label>
                {errEl("consent")}
                {status === "error" && (
                  <p role="alert" className="m-0 mt-4 text-sm text-danger">
                    {v.error}
                  </p>
                )}
              </>
            )}

            {done && (
              <div className="pt-10 pb-5" role="status">
                <Star size={40} dark className="mb-8" />
                <h2 className="m-0 mb-[18px] text-[44px] leading-[1.08] font-medium tracking-[-.02em] max-md:text-[34px]">
                  {t.done.title}
                </h2>
                <p className="m-0 mb-10 max-w-[440px] text-[17px] leading-7 text-muted">{t.done.text}</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 bg-ink px-8 py-5 text-[15px] leading-none font-medium text-white transition-opacity hover:opacity-88"
                >
                  {t.done.cta}
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {!done && (
          <div className="mt-14 flex items-center justify-between gap-3 border-t-[0.5px] border-[rgb(18_21_28/0.1)] pt-7">
            <button
              type="button"
              onClick={() => (setErrors({}), go(Math.max(0, step - 1)))}
              className="border-0 bg-transparent px-2 py-5 text-[15px] leading-none text-muted transition-colors hover:text-ink"
              style={{ visibility: step === 0 ? "hidden" : "visible" }}
            >
              {t.back}
            </button>
            <button
              type="button"
              onClick={next}
              disabled={status === "sending"}
              className="flex items-center gap-3 border-0 bg-ink px-10 py-[22px] text-base leading-none font-medium text-white transition-opacity duration-300 hover:opacity-88 disabled:opacity-60 max-md:px-7"
            >
              {status === "sending" ? t.sending : step === TOTAL - 1 ? t.submit : t.next} <Star size={14} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
