import { SESSION_COOKIE } from "@/lib/auth/config";
import { EMAIL_RE, MIN_PASSWORD, json, sameOrigin } from "@/lib/auth/http";
import { hashPassword } from "@/lib/auth/password";
import {
  createUser,
  findUserByEmail,
  toPublicUser,
} from "@/lib/auth/repository";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);

  let body: { name?: unknown; email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 1) return json({ error: "name_required" }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "invalid_email" }, 400);
  if (password.length < MIN_PASSWORD)
    return json({ error: "weak_password" }, 400);

  try {
    const existing = await findUserByEmail(email);
    if (existing) return json({ error: "email_taken" }, 409);

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      email,
      name,
      image: null,
      passwordHash,
      provider: "credentials",
      googleSub: null,
    });
    const publicUser = toPublicUser(user);
    const token = await createSessionToken(publicUser);

    const res = json({ user: publicUser }, 201);
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (error) {
    if (error instanceof Error && error.message === "email_taken") {
      return json({ error: "email_taken" }, 409);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      (error as { code?: string }).code === "23505"
    ) {
      return json({ error: "email_taken" }, 409);
    }
    console.error("signup failed", error);
    return json({ error: "server_error" }, 500);
  }
}
