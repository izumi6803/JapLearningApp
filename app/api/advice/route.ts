import { currentUser } from "@/lib/auth/guard";
import { openaiApiKey, openaiBaseUrl, openaiModel } from "@/lib/auth/config";
import { json, sameOrigin } from "@/lib/auth/http";
import { buildSnapshot, ruleAdvice } from "@/lib/insights";
import { getLessons } from "@/lib/lessons/repository";
import { sanitizeProgress } from "@/lib/progress-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `You are a warm, concise Japanese-study coach for a student working through the Minna no Nihongo series and JLPT N5–N1 material. Given a JSON snapshot of their progress, reply with 2–4 short sentences of specific, encouraging advice: what to review right now, whether their streak is at risk, and which unit to tackle next. Plain text only, no markdown or bullet symbols, under 90 words. Write directly to the student.`;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);
  const user = await currentUser();
  if (!user) return json({ error: "unauthorized" }, 401);

  let body: { progress?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const lessons = await getLessons();
  const snapshot = buildSnapshot(sanitizeProgress(body.progress), lessons);

  if (!openaiApiKey) {
    return json({ advice: ruleAdvice(snapshot), source: "rules", snapshot });
  }

  try {
    const res = await fetch(`${openaiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0.6,
        max_tokens: 800,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: JSON.stringify(snapshot) },
        ],
      }),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const advice = data.choices?.[0]?.message?.content?.trim();
    if (!advice) throw new Error("empty completion");
    return json({ advice, source: "llm", snapshot });
  } catch (error) {
    console.error("advice failed", error);
    return json({ advice: ruleAdvice(snapshot), source: "rules", snapshot });
  }
}
