import { appUrl, cronSecret } from "@/lib/auth/config";
import { digestEmailHtml, emailConfigured, sendEmail } from "@/lib/auth/email";
import { json } from "@/lib/auth/http";
import { getProgress, listUsers } from "@/lib/auth/repository";
import { buildSnapshot } from "@/lib/insights";
import { getLessons } from "@/lib/lessons/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return json({ error: "forbidden" }, 403);
  }
  if (!emailConfigured()) {
    return json({ error: "email_not_configured" }, 503);
  }

  const [{ users }, lessons] = await Promise.all([
    listUsers({ limit: 500 }),
    getLessons(),
  ]);
  let candidates = 0;
  let sent = 0;

  for (const user of users) {
    if (user.status === "disabled") continue;
    const progress = await getProgress(user.id);
    if (!progress) continue;

    const snapshot = buildSnapshot(progress, lessons);
    const streakAtRisk =
      !snapshot.streak.studiedToday && snapshot.streak.current > 0;
    if (snapshot.dueForReview === 0 && !streakAtRisk) continue;

    candidates++;
    const ok = await sendEmail({
      to: user.email,
      subject: "Your 日本語 review is waiting — みんなの日本語",
      html: digestEmailHtml({
        name: user.name ?? "there",
        streak: snapshot.streak.current,
        studiedToday: snapshot.streak.studiedToday,
        due: snapshot.dueForReview,
        nextLesson: snapshot.nextLesson
          ? `${snapshot.nextLesson.level} Lesson ${snapshot.nextLesson.number}「${snapshot.nextLesson.title}」`
          : null,
        url: appUrl,
      }),
    });
    if (ok) sent++;
  }

  return json({ ok: true, candidates, sent });
}
