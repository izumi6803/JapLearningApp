import { createHash, randomBytes } from "node:crypto";
import { appUrl } from "@/lib/auth/config";
import { emailConfigured, resetEmailHtml, sendEmail } from "@/lib/auth/email";
import { EMAIL_RE, json, sameOrigin } from "@/lib/auth/http";
import { createPasswordReset, findUserByEmail } from "@/lib/auth/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_MS = 30 * 60 * 1000;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);

  const body = (await request.json().catch(() => ({}))) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL_RE.test(email)) return json({ ok: true }); // no enumeration

  const user = await findUserByEmail(email);
  if (!user || !user.passwordHash) return json({ ok: true });

  if (!emailConfigured()) return json({ error: "email_not_configured" }, 503);

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await createPasswordReset(tokenHash, user.id, Date.now() + TTL_MS);

  const link = `${appUrl}/reset?token=${token}`;
  const sent = await sendEmail({
    to: user.email,
    subject: "Reset your password — みんなの日本語",
    html: resetEmailHtml(link),
  });
  if (!sent) return json({ error: "email_failed" }, 502);
  return json({ ok: true });
}
