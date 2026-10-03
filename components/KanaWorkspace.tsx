"use client";

import { useState } from "react";
import { kanaOf, type KanaEntry, type KanaScript } from "@/data/kana";
import type { Vocab } from "@/lib/types";
import { Flashcards } from "./Flashcards";
import { KanaChart } from "./KanaChart";
import { KanaQuiz } from "./KanaQuiz";

type Mode = "chart" | "cards" | "quiz";

const MODES: { id: Mode; kana: string; label: string }[] = [
  { id: "chart", kana: "五十音", label: "Chart" },
  { id: "cards", kana: "暗記", label: "Flashcards" },
  { id: "quiz", kana: "試験", label: "Quiz" },
];

function toVocab(entries: KanaEntry[], script: KanaScript): Vocab[] {
  return entries.map((e) => ({
    id: `${script}:${e.kana}`,
    term: e.kana,
    reading: e.alt,
    romaji: e.romaji,
    meaning: e.romaji,
    pos: script,
  }));
}

export function KanaWorkspace({
  initialScript = "hiragana",
}: {
  initialScript?: KanaScript;
}) {
  const [script, setScript] = useState<KanaScript>(initialScript);
  const [mode, setMode] = useState<Mode>("chart");

  const entries = kanaOf(script);
  const cards = toVocab(entries, script);

  return (
    <div>
      <div className="grid gap-4 border border-line bg-paper p-4 sm:grid-cols-[auto_1fr] sm:items-end">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sumi-soft">
            Script
          </span>
          <div className="mt-1.5 flex gap-1">
            {(
              [
                ["hiragana", "ひらがな", "Hiragana"],
                ["katakana", "カタカナ", "Katakana"],
              ] as const
            ).map(([id, kana, label]) => {
              const active = script === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setScript(id)}
                  className="border px-3.5 py-2 text-sm font-medium transition-colors"
                  style={
                    active
                      ? {
                          borderColor: "var(--color-sumi)",
                          background: "var(--color-sumi)",
                          color: "var(--color-paper)",
                        }
                      : {
                          borderColor: "var(--color-line)",
                          color: "var(--color-sumi-soft)",
                        }
                  }
                >
                  <span className="font-display">{kana}</span>
                  <span className="ml-1.5 hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:justify-self-end">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sumi-soft">
            Mode
          </span>
          <div className="mt-1.5 flex gap-1">
            {MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className="border px-3.5 py-2 text-sm font-medium transition-colors"
                  style={
                    active
                      ? {
                          borderColor: "var(--color-ai)",
                          background: "var(--color-ai)",
                          color: "var(--color-paper)",
                        }
                      : {
                          borderColor: "var(--color-line)",
                          color: "var(--color-sumi-soft)",
                        }
                  }
                >
                  <span className="font-display">{m.kana}</span>
                  <span className="ml-1.5 hidden sm:inline">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {mode === "chart" ? <KanaChart script={script} /> : null}
        {mode === "cards" ? (
          <Flashcards key={script} cards={cards} />
        ) : null}
        {mode === "quiz" ? <KanaQuiz key={script} script={script} /> : null}
      </div>
    </div>
  );
}
