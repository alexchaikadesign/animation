import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { flattenErrors, validateFiles } from "@/lib/validation";

export type Submission<T> = { kind: "contact" | "brief"; data: T; files: File[]; receivedAt: string };

/**
 * Разбор multipart-запроса формы: поле `data` (JSON) + `files[]`.
 * Возвращает валидированные данные либо готовый ответ 400.
 */
export async function parseSubmission<S extends z.ZodType>(req: Request, schema: S) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return { response: NextResponse.json({ ok: false }, { status: 400 }) };
  }
  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return { response: NextResponse.json({ ok: false }, { status: 400 }) };
  }
  const parsed = schema.safeParse(raw);
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const fileError = validateFiles(files);
  if (!parsed.success || fileError) {
    const errors = parsed.success ? {} : flattenErrors(parsed.error);
    if (fileError) errors.files = fileError;
    return { response: NextResponse.json({ ok: false, errors }, { status: 422 }) };
  }
  return { data: parsed.data as z.output<S>, files };
}

/**
 * Заглушка доставки заявки. Здесь подключается почта (Resend/SMTP) или CRM (amoCRM, Bitrix24, HubSpot…).
 * Сейчас просто пишет в лог сервера.
 */
export async function deliver<T>(submission: Submission<T>) {
  console.info(
    `[${submission.kind}] new submission`,
    JSON.stringify(submission.data),
    submission.files.map((f) => `${f.name} (${f.size} B)`),
  );
}
