import { NextResponse } from "next/server";
import { briefSchema } from "@/lib/validation";
import { deliver, parseSubmission } from "@/lib/server/submission";

/** POST /api/brief — онлайн-бриф */
export async function POST(req: Request) {
  const result = await parseSubmission(req, briefSchema);
  if ("response" in result) return result.response;
  await deliver({ kind: "brief", data: result.data, files: result.files, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
