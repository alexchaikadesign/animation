import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.email() });

/** POST /api/subscribe — подписка на рассылку (заглушка: подключить ESP / CRM). */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });
  console.info("[subscribe]", parsed.data.email);
  return NextResponse.json({ ok: true });
}
