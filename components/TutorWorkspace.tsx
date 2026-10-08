"use client";

import { useState } from "react";
import { Conversation } from "./Conversation";
import { TutorChat } from "./TutorChat";

type Mode = "tutor" | "conversation";

export function TutorWorkspace({ initialMode = "tutor" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);

  const tabs: { id: Mode; kana: string; label: string; blurb: string }[] = [
    {
      id: "tutor",
      kana: "先生",
      label: "AI Tutor",
      blurb: "Ask anything — grammar, vocabulary, or a sentence to fix.",
    },
    {
      id: "conversation",
      kana: "会話",
      label: "AI Conversation",
      blurb: "Roleplay real scenes by voice or typing, with corrections.",
    },
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Tutor mode"
        className="grid grid-cols-2 border-b border-line"
      >
        {tabs.map((t) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(t.id)}
              className="relative px-4 py-3 text-left transition-colors"
            >
              <span className="font-display text-base font-semibold text-sumi">
                {t.kana}
              </span>
              <span className="ml-2 font-medium text-sumi">{t.label}</span>
              <span className="mt-0.5 block text-xs text-sumi-soft">
                {t.blurb}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-x-4 -bottom-px h-[2px] origin-left transition-transform duration-300"
                style={{
                  backgroundColor: "var(--color-shu)",
                  transform: active ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="py-6">
        <div style={{ display: mode === "tutor" ? "block" : "none" }}>
          <TutorChat />
        </div>
        <div style={{ display: mode === "conversation" ? "block" : "none" }}>
          <Conversation />
        </div>
      </div>
    </div>
  );
}
