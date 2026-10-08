"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/lib/progress";

export function AdvisorCard() {
  const { user, loading } = useAuth();
  const { ready, state } = useProgress();
  const [advice, setAdvice] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getAdvice() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/advice", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ progress: state }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        advice?: string;
        source?: string;
        error?: string;
      };
      if (!res.ok || !data.advice) throw new Error(data.error ?? "failed");
      setAdvice(data.advice);
      setSource(data.source ?? null);
    } catch {
      setError("Could not fetch advice right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-line bg-paper p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-sumi-soft">
          助言 · Coach
        </p>
        {source ? (
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-sumi-soft">
            {source === "llm" ? "AI" : "auto"}
          </span>
        ) : null}
      </div>

      {!loading && !user ? (
        <>
          <p className="mt-3 text-sm text-sumi-soft">
            Sign in for personalized study advice based on your progress.
          </p>
          <Link
            href="/signin"
            className="mt-3 inline-block bg-sumi px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ai"
          >
            Sign in
          </Link>
        </>
      ) : advice ? (
        <p className="mt-3 whitespace-pre-line font-display text-[15px] leading-relaxed text-sumi">
          {advice}
        </p>
      ) : (
        <p className="mt-3 text-sm text-sumi-soft">
          Ask your coach what to do next — it reads your due cards, streak, and
          weak spots.
        </p>
      )}

      {!loading && user ? (
        <button
          type="button"
          onClick={getAdvice}
          disabled={busy || !ready}
          className="mt-4 border border-ai px-4 py-2 text-sm font-medium text-ai transition-colors hover:bg-ai hover:text-paper disabled:opacity-40"
        >
          {busy ? "Thinking…" : advice ? "Refresh advice" : "Get my plan"}
        </button>
      ) : null}

      {error ? <p className="mt-2 text-xs text-shu">{error}</p> : null}
    </div>
  );
}
