"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { countDue } from "@/lib/review";
import { computeStreak } from "@/lib/streak";
import type { Lesson } from "@/lib/types";

export function TodayStrip({ lessons }: { lessons: Lesson[] }) {
  const { ready, state, isLessonComplete } = useProgress();

  if (!ready) {
    return (
      <div className="h-28 animate-pulse border border-line bg-paper" />
    );
  }

  const streak = computeStreak(state.activity);
  const due = countDue(state);
  const next = lessons.find((l) => !isLessonComplete(l.id)) ?? null;

  return (
    <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
      <div className="bg-paper p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-sumi-soft">
          連続 · Streak
        </p>
        <p className="mt-2 font-display text-4xl font-semibold leading-none text-sumi">
          {streak.current}
          <span className="ml-1 text-lg text-sumi-soft">日</span>
        </p>
        <p className="mt-1.5 text-xs text-sumi-soft">
          {streak.studiedToday
            ? "Studied today — keep it going."
            : streak.current > 0
              ? "Study today to keep your streak."
              : "Start a streak today."}{" "}
          · best {streak.longest}
        </p>
      </div>

      <Link
        href="/review"
        className="bg-paper p-5 transition-colors hover:bg-washi"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-sumi-soft">
          復習 · Due
        </p>
        <p
          className="mt-2 font-display text-4xl font-semibold leading-none"
          style={{ color: due > 0 ? "var(--color-shu)" : "var(--color-sumi)" }}
        >
          {due}
        </p>
        <p className="mt-1.5 text-xs text-sumi-soft">
          {due > 0
            ? "Old cards are due — clear them."
            : "Nothing due right now."}
        </p>
      </Link>

      <Link
        href={next ? `/lessons/${next.id}` : "/roadmap"}
        className="bg-paper p-5 transition-colors hover:bg-washi"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-sumi-soft">
          次 · Up next
        </p>
        <p className="mt-2 font-display text-lg font-semibold leading-tight text-sumi">
          {next ? next.title : "All units done"}
        </p>
        <p className="mt-1.5 text-xs text-sumi-soft">
          {next
            ? `${next.level} · Lesson ${next.number}`
            : "Keep it warm with review."}
        </p>
      </Link>
    </div>
  );
}
