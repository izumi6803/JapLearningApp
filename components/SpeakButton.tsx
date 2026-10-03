"use client";

import { useState } from "react";
import { speakJa } from "@/lib/speech";

export function SpeakButton({
  text,
  label,
  tone = "ai",
}: {
  text: string;
  label?: string;
  tone?: "ai" | "shu";
}) {
  const [active, setActive] = useState(false);

  const color = tone === "shu" ? "var(--color-shu)" : "var(--color-ai)";

  return (
    <button
      type="button"
      aria-label={label ?? `Play pronunciation of ${text}`}
      title="Play pronunciation"
      onClick={() => {
        const ok = speakJa(text);
        if (ok) {
          setActive(true);
          window.setTimeout(() => setActive(false), 550);
        }
      }}
      className="inline-grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform hover:scale-110 active:scale-95"
      style={{ color, border: `1px solid ${color}40` }}
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={active ? "animate-pulse" : ""}
      >
        <path d="M4 9v6h3.5L12 19V5L7.5 9H4Z" />
        <path d="M16 8.5a4.5 4.5 0 0 1 0 7" />
        <path d="M18.5 6a8 8 0 0 1 0 12" />
      </svg>
    </button>
  );
}
