"use client";

import Link from "next/link";
import { lessons } from "@/data";
import { useProgress } from "@/lib/progress";
import { levelColor } from "@/lib/types";
import { Hanko } from "./Hanko";

export function ContinueStudying() {
  const { ready, state, isLessonComplete } = useProgress();

  const next = lessons.find((l) => !isLessonComplete(l.id));
  const doneCount = state.completed.length;

  if (!ready) {
    return (
      <div className="h-[92px] animate-pulse border border-line bg-paper" />
    );
  }

  if (!next) {
    return (
      <div className="flex items-center gap-4 border border-line bg-paper p-5">
        <Hanko size={48} label="完" />
        <div>
          <p className="font-display text-lg font-semibold">All units complete.</p>
          <p className="text-sm text-sumi-soft">
            Revisit any lesson to keep it sharp, or reset your progress from the
            progress page.
          </p>
        </div>
      </div>
    );
  }

  const color = levelColor(next.level);

  return (
    <Link
      href={`/lessons/${next.id}`}
      className="group grid grid-cols-[1fr_auto] items-center gap-4 border border-line bg-paper p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-24px_rgba(26,27,30,0.55)]"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-sumi-soft">
          {doneCount === 0 ? "Start here" : "Continue"} · Lesson {next.number} ·{" "}
          {next.level}
        </p>
        <p className="mt-1.5 font-display text-xl font-semibold text-sumi">
          {next.title}
        </p>
        <p className="text-sm text-sumi-soft">{next.titleEn}</p>
      </div>
      <span
        className="font-display text-2xl transition-transform duration-200 group-hover:translate-x-1"
        style={{ color }}
        aria-hidden="true"
      >
        へ
      </span>
    </Link>
  );
}
