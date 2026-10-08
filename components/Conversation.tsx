"use client";

import Link from "next/link";
import { useState } from "react";
import { getScenario, scenarios } from "@/data/scenarios";
import { levelColor } from "@/lib/types";
import { speakJa } from "@/lib/speech";
import { useAuth } from "./auth/AuthProvider";
import { SpeakButton } from "./SpeakButton";
import { MicButton } from "./voice/MicButton";

interface ConvTurn {
  role: "user" | "assistant";
  jp: string;
  en?: string | null;
  fix?: string | null;
}

export function Conversation({ initialScenarioId }: { initialScenarioId?: string }) {
  const { user, loading } = useAuth();
  const start = getScenario(initialScenarioId ?? "") ?? scenarios[0];
  const [scenarioId, setScenarioId] = useState(start.id);
  const [turns, setTurns] = useState<ConvTurn[]>(() => [
    { role: "assistant", jp: start.opener },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEn, setShowEn] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const scenario = getScenario(scenarioId) ?? scenarios[0];

  function chooseScenario(id: string) {
    const s = getScenario(id);
    if (!s) return;
    setScenarioId(id);
    setTurns([{ role: "assistant", jp: s.opener }]);
    setInput("");
    setError(null);
    if (autoSpeak) speakJa(s.opener);
  }

  async function send(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    const history: ConvTurn[] = [...turns, { role: "user", jp: value }];
    setTurns(history);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "conversation",
          scenarioId,
          messages: history.map((t) => ({ role: t.role, content: t.jp })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        parsed?: { jp: string; en: string | null; fix: string | null };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "failed");
      const parsed = data.parsed ?? { jp: data.reply ?? "", en: null, fix: null };
      setTurns((t) => [
        ...t,
        { role: "assistant", jp: parsed.jp, en: parsed.en, fix: parsed.fix },
      ]);
      if (autoSpeak && parsed.jp) speakJa(parsed.jp);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(
        code === "ai_not_configured"
          ? "Conversation isn’t configured yet."
          : code === "slow_down"
            ? "One moment — try again."
            : "No reply just now. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-sumi-soft">Loading…</p>;
  if (!user) {
    return (
      <div className="border border-line bg-paper p-6">
        <p className="text-sm text-sumi-soft">
          Sign in to practise real conversations with a patient roleplay partner
          — by voice or typed.
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
      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => {
          const active = s.id === scenarioId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => chooseScenario(s.id)}
              className="border px-3 py-1.5 text-left text-sm transition-colors"
              style={
                active
                  ? {
                      borderColor: levelColor(s.level),
                      background: levelColor(s.level),
                      color: "var(--color-paper)",
                    }
                  : { borderColor: "var(--color-line)" }
              }
            >
              <span className="font-display">{s.title}</span>
              <span
                className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ opacity: active ? 0.8 : 0.6 }}
              >
                {s.level}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-xs text-sumi-soft">{scenario.titleEn}</p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sumi-soft">
            <input
              type="checkbox"
              checked={showEn}
              onChange={(e) => setShowEn(e.target.checked)}
            />
            English
          </label>
          <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sumi-soft">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
            />
            Speak replies
          </label>
        </div>
      </div>

      <div className="mt-4 flex max-h-[26rem] min-h-[16rem] flex-col gap-4 overflow-y-auto pr-1">
        {turns.map((t, i) =>
          t.role === "user" ? (
            <div key={i} className="self-end">
              <div className="max-w-[34rem] bg-ai px-4 py-2.5 font-display text-[15px] text-paper">
                {t.jp}
              </div>
            </div>
          ) : (
            <div key={i} className="self-start">
              <div className="max-w-[34rem] border border-line bg-paper px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <p className="font-display text-[15px] leading-relaxed text-sumi">
                    {t.jp}
                  </p>
                  <SpeakButton text={t.jp} tone="shu" />
                </div>
                {showEn && t.en ? (
                  <p className="mt-1.5 border-t border-line pt-1.5 font-mono text-[11px] text-sumi-soft">
                    {t.en}
                  </p>
                ) : null}
                {t.fix ? (
                  <p className="mt-2 border-l-2 border-kin pl-2 text-xs text-sumi">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-kin">
                      correction
                    </span>{" "}
                    {t.fix}
                  </p>
                ) : null}
              </div>
            </div>
          ),
        )}
        {busy ? (
          <p className="self-start font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
            replying…
          </p>
        ) : null}
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
          placeholder="Type or speak your reply in Japanese…"
          className="min-h-[2.75rem] flex-1 resize-none border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ai"
        />
        <button
          type="button"
          onClick={() => void send(input)}
          disabled={busy || !input.trim()}
          className="h-10 shrink-0 bg-sumi px-5 text-sm font-medium text-paper transition-colors hover:bg-ai disabled:opacity-40"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
