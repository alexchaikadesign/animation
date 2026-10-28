import { z } from "zod";
import { getDictionary } from "@/content";
import { COUNTRIES, toE164 } from "./phone";

const v = getDictionary().validation;

export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_FILES = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.png,.jpg,.jpeg,.webp,.fig,.zip";

const looseUrl = z
  .string()
  .trim()
  .max(300)
  .refine((s) => s === "" || /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(s), v.url);

const phone = z
  .object({ country: z.string().refine((c) => COUNTRIES.some((x) => x.iso === c)), number: z.string() })
  .refine((p) => toE164(p.country, p.number) !== null, { message: v.phone, path: ["number"] })
  .transform((p) => ({ ...p, e164: toE164(p.country, p.number) as string }));

export const contactSchema = z.object({
  name: z.string().trim().min(2, v.name).max(120),
  phone,
  company: z.string().trim().max(160).default(""),
  website: looseUrl.default(""),
  about: z.string().trim().max(5000).default(""),
  consent: z.literal(true, { error: v.consent }),
});
export type ContactInput = z.input<typeof contactSchema>;

export const briefSchema = z.object({
  services: z.array(z.string()).min(1, v.services),
  stages: z.array(z.string()).default([]),
  industries: z.array(z.string()).default([]),
  idea: z.string().trim().max(5000).default(""),
  goals: z.string().trim().max(1000).default(""),
  audience: z.string().trim().max(1000).default(""),
  website: looseUrl.default(""),
  competitors: z.string().trim().max(1000).default(""),
  references: z.string().trim().max(2000).default(""),
  terms: z.array(z.string()).default([]),
  budgets: z.array(z.string()).default([]),
  name: z.string().trim().min(2, v.name).max(120),
  phone,
  email: z.email(v.email),
  company: z.string().trim().max(160).default(""),
  channels: z.array(z.string()).default([]),
  consent: z.literal(true, { error: v.consent }),
});
export type BriefInput = z.input<typeof briefSchema>;

/** Поля брифа, проверяемые на каждом шаге перед переходом дальше. */
export const briefStepFields: (keyof BriefInput)[][] = [["services"], [], ["website"], [], ["name", "phone", "email", "consent"]];

export function validateFiles(files: File[]): string | null {
  if (files.length > MAX_FILES) return v.fileCount;
  if (files.some((f) => f.size > MAX_FILE_SIZE)) return v.fileSize;
  return null;
}

/** Плоская карта ошибок zod: { "phone.number": "…", name: "…" } → по первому сегменту пути. */
export function flattenErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
