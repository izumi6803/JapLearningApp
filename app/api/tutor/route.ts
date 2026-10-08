import { getScenario } from "@/data/scenarios";
import { openaiApiKey, openaiBaseUrl, openaiModel } from "@/lib/auth/config";
import { currentUser } from "@/lib/auth/guard";
import { json, sameOrigin } from "@/lib/auth/http";
import { getLesson } from "@/lib/lessons/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 24;
const MAX_CHARS = 1000;

const throttle = new Map<string, number>();
const THROTTLE_MS = 1500;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function lessonContext(lessonId: string): Promise<string> {
  if (!lessonId) return "";
  const lesson = await getLesson(lessonId);
  if (!lesson) return "";
  const vocab = lesson.vocab
    .slice(0, 40)
    .map((v) => `${v.term}(${v.reading}) = ${v.meaning}`)
    .join("; ");
  const grammar = lesson.grammar
    .map((g) => `${g.point} — ${g.meaning}`)
    .join("; ");
  return `\n\nContext — the student is on ${lesson.source}: Lesson ${lesson.number}「${lesson.title}」.\nVocabulary: ${vocab}\nGrammar points: ${grammar}`;
}

async function buildSystem(
  mode: "tutor" | "conversation",
  lessonId: string,
  scenarioId: string,
): Promise<string> {
  if (mode === "conversation") {
    const scenario = getScenario(scenarioId) ?? getScenario("freetalk")!;
    return `You are roleplaying this scene: ${scenario.setting}. Keep the scene alive with the student, who is around JLPT ${scenario.level}. Speak ONLY natural Japanese, 1–2 short sentences per turn, and end most turns with a question. Stay strictly in character and never break the scene.
If the student's last message contains a clear grammar or vocabulary mistake, add exactly one short correction.
Reply in exactly this format, on separate lines, with nothing else:
JP: <your Japanese line(s)>
EN: <an English translation>
FIX: <one short correction of the student's last message, or "none">`;
  }

  const context = await lessonContext(lessonId);
  return `You are 先生, a patient and encouraging Japanese tutor helping a student work through the Minna no Nihongo series toward the JLPT. Answer their questions, explain grammar clearly, and give short example sentences. For any Japanese you write, follow it with the kana reading in parentheses and a brief English gloss. Match the student's level, keep replies under 160 words, and use plain text (no markdown headings).${context}`;
}

interface ParsedReply {
  jp: string;
  en: string | null;
  fix: string | null;
}

function grab(text: string, label: string): string | null {
  const re = new RegExp(`${label}\\s*([\\s\\S]*?)(?=\\n(?:JP:|EN:|FIX:)|$)`);
  const match = text.match(re);
  return match ? match[1].trim() : null;
}

function parseConversation(text: string): ParsedReply {
  const jp = grab(text, "JP:");
  const en = grab(text, "EN:");
  const fix = grab(text, "FIX:");
  return {
    jp: jp || text.trim(),
    en: en || null,
    fix: fix && fix.toLowerCase() !== "none" && fix !== "-" ? fix : null,
  };
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);
  const user = await currentUser();
  if (!user) return json({ error: "unauthorized" }, 401);
  if (!openaiApiKey) return json({ error: "ai_not_configured" }, 503);

  const now = Date.now();
  if (now - (throttle.get(user.id) ?? 0) < THROTTLE_MS) {
    return json({ error: "slow_down" }, 429);
  }

  let body: {
    mode?: unknown;
    lessonId?: unknown;
    scenarioId?: unknown;
    messages?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const mode = body.mode === "conversation" ? "conversation" : "tutor";
  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
  const scenarioId = typeof body.scenarioId === "string" ? body.scenarioId : "";

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMessage[] = incoming
    .slice(-MAX_MESSAGES)
    .filter(
      (m): m is { role: string; content: string } =>
        Boolean(m) &&
        typeof m === "object" &&
        typeof (m as { content?: unknown }).content === "string",
    )
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content.slice(0, MAX_CHARS),
    }));
  if (messages.length === 0) return json({ error: "empty" }, 400);

  throttle.set(user.id, now);

  try {
    const res = await fetch(`${openaiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0.7,
        max_tokens: 800,
        messages: [
          {
            role: "system",
            content: await buildSystem(mode, lessonId, scenarioId),
          },
          ...messages,
        ],
      }),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("empty completion");

    return json({
      reply: content,
      parsed: mode === "conversation" ? parseConversation(content) : null,
    });
  } catch (error) {
    console.error("tutor failed", error);
    return json({ error: "ai_failed" }, 502);
  }
}
