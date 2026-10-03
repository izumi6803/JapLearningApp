"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/progress";
import { speakJa } from "@/lib/speech";
import type { Vocab } from "@/lib/types";
import { Hanko } from "./Hanko";
import { ProgressBar } from "./ProgressBar";
import { SpeakButton } from "./SpeakButton";

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function Flashcards({ cards }: { cards: Vocab[] }) {
  const { ready, state, recordCard } = useProgress();
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const [queue, setQueue] = useState<Vocab[]>([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [missed, setMissed] = useState(0);
  const [runId, setRunId] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const boxOf = (id: string) => stateRef.current.cards[id]?.box ?? -1;
    const ordered = [...cards].sort((a, b) => boxOf(a.id) - boxOf(b.id));
    setQueue(shuffle(ordered));
    setPos(0);
    setFlipped(false);
    setKnown(0);
    setMissed(0);
    setStarted(true);
  }, [ready, cards, runId]);

  const current = queue[pos];
  const finished = started && pos >= queue.length && queue.length > 0;

  const grade = useCallback(
    (correct: boolean) => {
      if (!current) return;
      recordCard(current.id, correct);
      if (correct) {
        setKnown((n) => n + 1);
      } else {
        setMissed((m) => m + 1);
        setQueue((q) => [...q, current]);
      }
      setFlipped(false);
      setPos((p) => p + 1);
    },
    [current, recordCard],
  );

  useEffect(() => {
    if (!started || finished) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") {
        grade(true);
      } else if (e.key === "ArrowLeft") {
        grade(false);
      } else if (e.key.toLowerCase() === "s" && current) {
        speakJa(current.term);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, finished, grade, current]);

  if (!started || cards.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-sumi-soft">
        {cards.length === 0 ? "This unit has no vocabulary cards." : "Shuffling…"}
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((known / (known + missed)) * 100);
    const passed = pct >= 70;
    return (
      <div className="flex flex-col items-center border border-line bg-paper px-6 py-14 text-center">
        {passed ? (
          <Hanko size={72} animate />
        ) : (
          <span className="font-display text-5xl text-sumi">復習</span>
        )}
        <h3 className="mt-6 font-display text-2xl font-semibold text-sumi">
          Deck cleared
        </h3>
        <p className="mt-1 text-sm text-sumi-soft">
          {known} recalled · {missed} to review · {pct}%
        </p>
        <button
          type="button"
          onClick={() => setRunId((n) => n + 1)}
          className="mt-7 border border-sumi px-5 py-2 text-sm font-medium transition-colors hover:bg-sumi hover:text-paper"
        >
          Study again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar
            value={(known / queue.length) * 100}
            label={`Card ${pos + 1} of ${queue.length}`}
          />
        </div>
        <span className="font-mono text-[11px] text-sumi-soft">
          {known} 覚 / {missed} 復
        </span>
      </div>

      <div style={{ perspective: "1400px" }}>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className={`card-flip relative block w-full text-left ${
            flipped ? "is-flipped" : ""
          }`}
          style={{ minHeight: "20rem" }}
          aria-label="Flip card"
        >
          {/* front */}
          <span className="card-face genko-cell paper-grid flex min-h-[20rem] w-full flex-col items-center justify-center border border-line bg-paper px-6 py-10">
            <span className="font-display text-5xl font-semibold leading-tight text-sumi sm:text-6xl">
              {current.term}
            </span>
            <span className="mt-8 font-mono text-[10px] uppercase tracking-[0.28em] text-sumi-soft">
              tap to reveal · space
            </span>
          </span>

          {/* back */}
          <span className="card-face card-back absolute inset-0 flex min-h-[20rem] w-full flex-col items-start justify-center border border-line bg-paper px-8 py-10">
            <span className="font-display text-3xl text-sumi">
              {current.term}
            </span>
            <span className="mt-2 font-display text-2xl text-ai">
              {current.reading}
            </span>
            <span className="mt-4 border-t border-line pt-4 text-xl text-sumi">
              {current.meaning}
            </span>
            <span className="mt-1 font-mono text-[11px] text-sumi-soft">
              {current.romaji}
              {current.pos ? ` · ${current.pos}` : ""}
            </span>
            {current.example ? (
              <span className="mt-4 block border-l-2 border-ai/30 pl-3">
                <span className="block font-display text-sm text-sumi">
                  {current.example.jp}
                </span>
                <span className="mt-0.5 block text-xs text-sumi-soft">
                  {current.example.en}
                </span>
              </span>
            ) : null}
          </span>
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <span onClick={(e) => e.stopPropagation()}>
          <SpeakButton text={current.term} />
        </span>
        <button
          type="button"
          onClick={() => grade(false)}
          className="min-w-[7rem] border border-shu px-5 py-2.5 text-sm font-medium text-shu transition-colors hover:bg-shu hover:text-paper"
        >
          もう一度 <span className="font-mono text-[10px]">←</span>
        </button>
        <button
          type="button"
          onClick={() => grade(true)}
          className="min-w-[7rem] border border-matcha px-5 py-2.5 text-sm font-medium text-matcha transition-colors hover:bg-matcha hover:text-paper"
        >
          わかった <span className="font-mono text-[10px]">→</span>
        </button>
      </div>
    </div>
  );
}
