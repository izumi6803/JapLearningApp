import { createHash } from "node:crypto";
import { MIN_PASSWORD, json, sameOrigin } from "@/lib/auth/http";
import { hashPassword } from "@/lib/auth/password";
import { consumePasswordReset, updatePassword } from "@/lib/auth/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);

  const body = (await request.json().catch(() => ({}))) as {
    token?: unknown;
    password?: unknown;
  };
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!token) return json({ error: "invalid_token" }, 400);
  if (password.length < MIN_PASSWORD) return json({ error: "weak_password" }, 400);

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const userId = await consumePasswordReset(tokenHash);
  if (!userId) return json({ error: "invalid_token" }, 400);

  await updatePassword(userId, await hashPassword(password));
  return json({ ok: true });
}
