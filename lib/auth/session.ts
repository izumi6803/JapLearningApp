import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  authSecret,
  isProduction,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "./config";
import type { PublicUser } from "./repository";

export type SessionUser = PublicUser;

export async function createSessionToken(user: PublicUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    image: user.image,
    provider: user.provider,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(authSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, authSecret());
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      email: typeof payload.email === "string" ? payload.email : "",
      name: typeof payload.name === "string" ? payload.name : null,
      image: typeof payload.image === "string" ? payload.image : null,
      provider: payload.provider === "google" ? "google" : "credentials",
      role: payload.role === "admin" ? "admin" : "student",
      hasPassword: false,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions(maxAge: number = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
    maxAge,
  };
}
