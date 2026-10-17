import { openaiApiKey, openaiBaseUrl, openaiModel } from "@/lib/auth/config";

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function aiConfigured(): boolean {
  return Boolean(openaiApiKey);
}

/**
 * Minimal OpenAI-compatible chat call. Works with OpenCode Go, OpenAI,
 * Groq, OpenRouter, etc. For OpenCode Go we send the session id and a
 * custom user agent it asks for.
 */
export async function aiChat(
  messages: AiMessage[],
  options: {
    session: string;
    maxTokens?: number;
    temperature?: number;
  },
): Promise<string> {
  const res = await fetch(`${openaiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "content-type": "application/json",
      "user-agent": "japlearning-companion/1.0",
      "x-opencode-session": options.session.slice(0, 120),
    },
    body: JSON.stringify({
      model: openaiModel,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 800,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("empty completion");
  return content;
}
