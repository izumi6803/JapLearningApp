"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { lessons } from "@/data";
import { useAuth } from "./auth/AuthProvider";
import { MicButton } from "./voice/MicButton";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Explain the difference between は and が",
  "How do I use ～てください?",
  "Correct this: 私は昨日に東京へ行きます",
  "Give me 5 example sentences with ～ながら",
];

export function TutorChat() {
  const { user, loading } = useAuth();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => {
    requestAnimationFrame(() =>
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
    );
  };

  async function send(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    const history: Turn[] = [...turns, { role: "user", content: value }];
    setTurns(history);
    setInput("");
    setBusy(true);
    setError(null);
    scrollToEnd();
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "tutor", lessonId, messages: history }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };
      if (!res.ok || !data.reply) throw new Error(data.error ?? "failed");
      setTurns((t) => [...t, { role: "assistant", content: data.reply! }]);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(
        code === "ai_not_configured"
          ? "The AI tutor isn’t configured yet."
          : code === "slow_down"
            ? "One moment — try again."
            : "The tutor couldn’t answer right now.",
      );
    } finally {
      setBusy(false);
      scrollToEnd();
    }
  }

  if (loading) return <p className="text-sm text-sumi-soft">Loading…</p>;
  if (!user) {
    return (
      <div className="border border-line bg-paper p-6">
        <p className="text-sm text-sumi-soft">
          Sign in to ask the AI tutor anything about grammar, vocabulary, or a
          sentence you’re stuck on.
        </p>
        <Link
          href="/signin?next=/tutor"
          className="mt-4 inline-block bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sumi-soft">
          Ground the tutor in a unit (optional)
        </p>
        <select
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          className="border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-ai"
        >
          <option value="">No specific unit</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.level} · {String(l.number).padStart(2, "0")} {l.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex max-h-[26rem] min-h-[16rem] flex-col gap-4 overflow-y-auto pr-1">
        {turns.length === 0 ? (
          <div className="py-6">
            <p className="text-sm text-sumi-soft">Try one of these:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="border border-line px-3 py-1.5 text-left text-sm transition-colors hover:border-ai hover:text-ai"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          turns.map((t, i) =>
            t.role === "user" ? (
              <div key={i} className="self-end">
                <div className="max-w-[36rem] whitespace-pre-line bg-ai px-4 py-2.5 text-sm text-paper">
                  {t.content}
                </div>
              </div>
            ) : (
              <div key={i} className="self-start">
                <div className="flex items-start gap-3 border border-line bg-paper px-4 py-3">
                  <span className="mt-1 font-display text-lg leading-none text-shu">
                    先
                  </span>
                  <p className="whitespace-pre-line font-display text-[15px] leading-relaxed text-sumi">
                    {t.content}
                  </p>
                </div>
              </div>
            ),
          )
        )}
        {busy ? (
          <p className="self-start font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
            先生 is thinking…
          </p>
        ) : null}
        <div ref={endRef} />
      </div>

      {error ? <p className="mt-3 text-sm text-shu">{error}</p> : null}

      <div className="mt-4 flex items-end gap-2 border-t border-line pt-4">
        <MicButton onText={(t) => setInput((v) => (v ? `${v} ${t}` : t))} disabled={busy} />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          rows={2}
          placeholder="Ask about grammar, vocabulary, or paste a sentence…"
          className="min-h-[2.75rem] flex-1 resize-none border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ai"
        />
        <button
          type="button"
          onClick={() => void send(input)}
          disabled={busy || !input.trim()}
          className="h-10 shrink-0 bg-sumi px-5 text-sm font-medium text-paper transition-colors hover:bg-ai disabled:opacity-40"
        >
          Ask
        </button>
      </div>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sumi-soft">
        AI can make mistakes — verify against the textbook.
      </p>
    </div>
  );
}
