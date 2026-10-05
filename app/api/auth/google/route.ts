import { SESSION_COOKIE, isAdminEmail } from "@/lib/auth/config";
import { verifyGoogleCredential } from "@/lib/auth/google";
import { json, sameOrigin } from "@/lib/auth/http";
import {
  createUser,
  findUserByEmail,
  findUserByGoogleSub,
  linkGoogleAccount,
  setUserRole,
  toPublicUser,
  touchLogin,
  type User,
} from "@/lib/auth/repository";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);

  let body: { credential?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const credential =
    typeof body.credential === "string" ? body.credential : "";
  if (!credential) return json({ error: "invalid_request" }, 400);

  try {
    const profile = await verifyGoogleCredential(credential);

    let user: User | null = await findUserByGoogleSub(profile.sub);

    if (!user) {
      const byEmail = await findUserByEmail(profile.email);
      if (byEmail) {
        await linkGoogleAccount(byEmail.id, profile.sub, profile.picture);
        user = {
          ...byEmail,
          googleSub: profile.sub,
          image: profile.picture ?? byEmail.image,
        };
      } else {
        user = await createUser({
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          passwordHash: null,
          provider: "google",
          googleSub: profile.sub,
        });
      }
    } else {
      await touchLogin(user.id);
    }

    if (user.status === "disabled") {
      return json({ error: "account_disabled" }, 403);
    }
    if (isAdminEmail(user.email) && user.role !== "admin") {
      await setUserRole(user.id, "admin");
      user.role = "admin";
    }

    const publicUser = toPublicUser(user);
    const token = await createSessionToken(publicUser);
    const res = json({ user: publicUser });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "google_not_configured") {
      return json({ error: "google_not_configured" }, 400);
    }
    if (message === "invalid_google_token") {
      return json({ error: "invalid_google_token" }, 401);
    }
    console.error("google sign-in failed", error);
    return json({ error: "server_error" }, 500);
  }
}
