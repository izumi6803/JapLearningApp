export const SESSION_COOKIE = "nihongo_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const isProduction = process.env.NODE_ENV === "production";

export const databaseUrl = process.env.DATABASE_URL ?? "";

export const googleClientId =
  process.env.GOOGLE_CLIENT_ID ??
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  "";

export const publicGoogleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  process.env.GOOGLE_CLIENT_ID ??
  "";

const DEV_SECRET = "dev-insecure-secret-change-me-in-production";

export function authSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (isProduction) throw new Error("AUTH_SECRET must be set in production");
    return new TextEncoder().encode(DEV_SECRET);
  }
  return new TextEncoder().encode(secret);
}
