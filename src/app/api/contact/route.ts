import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { deliver, parseSubmission } from "@/lib/server/submission";

/** POST /api/contact — заявка из формы «Обсудим вашу идею?» */
export async function POST(req: Request) {
  const result = await parseSubmission(req, contactSchema);
  if ("response" in result) return result.response;
  await deliver({ kind: "contact", data: result.data, files: result.files, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
