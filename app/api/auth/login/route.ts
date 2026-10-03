import { SESSION_COOKIE } from "@/lib/auth/config";
import { json, sameOrigin } from "@/lib/auth/http";
import { verifyPassword } from "@/lib/auth/password";
import { findUserByEmail, toPublicUser } from "@/lib/auth/repository";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);

  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return json({ error: "invalid_credentials" }, 401);

  try {
    const user = await findUserByEmail(email);
    if (!user) return json({ error: "invalid_credentials" }, 401);
    if (!user.passwordHash) return json({ error: "use_google" }, 400);

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return json({ error: "invalid_credentials" }, 401);

    const publicUser = toPublicUser(user);
    const token = await createSessionToken(publicUser);
    const res = json({ user: publicUser });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (error) {
    console.error("login failed", error);
    return json({ error: "server_error" }, 500);
  }
}
