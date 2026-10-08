import { emailFrom, resendApiKey } from "./config";

export function emailConfigured(): boolean {
  return Boolean(resendApiKey);
}

interface EmailInput {
  to: string;
  subject: string;
  html: string;
}

/** Sends via Resend's REST API (no SDK). Returns false when not configured. */
export async function sendEmail({ to, subject, html }: EmailInput): Promise<boolean> {
  if (!resendApiKey) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from: emailFrom, to, subject, html }),
    });
    if (!res.ok) {
      console.error("resend failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("resend error", error);
    return false;
  }
}

export function digestEmailHtml(input: {
  name: string;
  streak: number;
  studiedToday: boolean;
  due: number;
  nextLesson: string | null;
  url: string;
}): string {
  const { name, streak, studiedToday, due, nextLesson, url } = input;
  const streakLine =
    streak > 0
      ? studiedToday
        ? `🔥 ${streak}-day streak — keep it alive.`
        : `🔥 Your ${streak}-day streak is at risk today.`
      : "Start a new streak today.";
  return `
  <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1b1e">
    <p style="font-size:20px;font-weight:600;margin:0 0 4px">みんなの日本語</p>
    <p style="color:#565860;margin:0 0 20px">Today's study reminder</p>
    <p>Hi ${name},</p>
    <p>${streakLine}</p>
    ${due > 0 ? `<p><strong>${due}</strong> card${due === 1 ? "" : "s"} from earlier lessons are due for review.</p>` : ""}
    ${nextLesson ? `<p>Next up: <strong>${nextLesson}</strong>.</p>` : ""}
    <p style="margin:24px 0">
      <a href="${url}/review" style="background:#c0362c;color:#fbf9f3;padding:12px 20px;text-decoration:none">Review now</a>
    </p>
    <p style="color:#565860;font-size:13px">You receive this because you have a みんなの日本語 account. Manage notifications from your account page.</p>
  </div>`;
}

export function resetEmailHtml(link: string): string {
  return `
  <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1b1e">
    <p style="font-size:20px;font-weight:600;margin:0 0 8px">みんなの日本語</p>
    <p style="color:#565860;margin:0 0 20px">Reset your password</p>
    <p>We received a request to reset your password. This link expires in 30 minutes.</p>
    <p style="margin:24px 0">
      <a href="${link}" style="background:#1f3a5f;color:#fbf9f3;padding:12px 20px;text-decoration:none">Choose a new password</a>
    </p>
    <p style="color:#565860;font-size:13px">If you didn't request this, you can ignore this email.</p>
  </div>`;
}
