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

export const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export function isAdminEmail(email: string): boolean {
  return adminEmails.has(email.trim().toLowerCase());
}

export const resendApiKey = process.env.RESEND_API_KEY ?? "";
export const emailFrom = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

export const appUrl =
  process.env.APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const DEV_SECRET = "dev-insecure-secret-change-me-in-production";

export function authSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (isProduction) throw new Error("AUTH_SECRET must be set in production");
    return new TextEncoder().encode(DEV_SECRET);
  }
  return new TextEncoder().encode(secret);
}
