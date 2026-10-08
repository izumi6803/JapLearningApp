"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { reviewDeck } from "@/lib/review";
import { Flashcards } from "./Flashcards";
import { Hanko } from "./Hanko";

export function ReviewSession() {
  const { ready, state } = useProgress();

  if (!ready) {
    return <p className="text-sm text-sumi-soft">Loading your review deck…</p>;
  }

  const { deck, due, weak } = reviewDeck(state);

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center border border-line bg-paper px-6 py-14 text-center">
        <Hanko size={64} label="済" />
        <h2 className="mt-6 font-display text-2xl font-semibold text-sumi">
          Nothing due right now
        </h2>
        <p className="mt-2 max-w-md text-sm text-sumi-soft">
          Cards come back here as their review interval elapses. Study a lesson
          or the kana to build your queue.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/lessons"
            className="bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai"
          >
            Browse lessons
          </Link>
          <Link
            href="/kana"
            className="border border-line px-5 py-2.5 text-sm font-medium text-sumi transition-colors hover:border-sumi"
          >
            Practice kana
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-sumi-soft">
        <span>{deck.length} cards in this session</span>
        <span style={{ color: "var(--color-shu)" }}>{due} due</span>
        <span>{weak} weak</span>
      </div>
      <Flashcards cards={deck} />
    </div>
  );
}
