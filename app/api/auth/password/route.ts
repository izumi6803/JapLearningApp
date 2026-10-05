import { currentUser } from "@/lib/auth/guard";
import { MIN_PASSWORD, json, sameOrigin } from "@/lib/auth/http";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { updatePassword } from "@/lib/auth/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Change your own password (also lets Google users set one). */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);
  const user = await currentUser();
  if (!user) return json({ error: "unauthorized" }, 401);

  const body = (await request.json().catch(() => ({}))) as {
    currentPassword?: unknown;
    newPassword?: unknown;
  };
  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < MIN_PASSWORD) return json({ error: "weak_password" }, 400);

  if (user.passwordHash) {
    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) return json({ error: "invalid_credentials" }, 401);
  }

  await updatePassword(user.id, await hashPassword(newPassword));
  return json({ ok: true });
}
