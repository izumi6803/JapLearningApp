import { createRemoteJWKSet, jwtVerify } from "jose";
import { googleClientId } from "./config";

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export interface GoogleProfile {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
}

export function googleConfigured(): boolean {
  return Boolean(googleClientId);
}

export async function verifyGoogleCredential(
  credential: string,
): Promise<GoogleProfile> {
  if (!googleClientId) throw new Error("google_not_configured");
  const { payload } = await jwtVerify(credential, JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: googleClientId,
  });
  if (!payload.sub || typeof payload.email !== "string") {
    throw new Error("invalid_google_token");
  }
  return {
    sub: payload.sub,
    email: payload.email.toLowerCase(),
    emailVerified: payload.email_verified === true,
    name: typeof payload.name === "string" ? payload.name : null,
    picture: typeof payload.picture === "string" ? payload.picture : null,
  };
}
