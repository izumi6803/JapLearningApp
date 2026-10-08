"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import {
  countsByLevel,
  LEVELS,
  lessonsOf,
  levelColor,
  type Lesson,
} from "@/lib/types";
import { LevelBadge } from "./LevelBadge";
import { ProgressBar } from "./ProgressBar";

export function LevelLadder({ lessons }: { lessons: Lesson[] }) {
  const { ready, state } = useProgress();
  const completed = new Set(state.completed);
  const counts = countsByLevel(lessons);

  return (
    <ol className="divide-y divide-line border-y border-line">
      {LEVELS.map((meta) => {
        const levelLessons = lessonsOf(lessons, meta.level);
        const done = ready
          ? levelLessons.filter((l) => completed.has(l.id)).length
          : 0;
        const total = counts[meta.level];
        const pct = total ? (done / total) * 100 : 0;

        return (
          <li key={meta.level}>
            <Link
              href={`/lessons?level=${meta.level}`}
              className="group grid items-center gap-x-4 gap-y-3 px-2 py-5 transition-colors hover:bg-paper sm:grid-cols-[7.5rem_1fr_10rem] sm:px-4"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="font-display text-4xl font-semibold leading-none sm:text-5xl"
                  style={{ color: levelColor(meta.level) }}
                >
                  {meta.level}
                </span>
                <span className="font-display text-sm text-sumi-soft">
                  {meta.kana}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-sumi">
                    {meta.name}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
                    {meta.level}
                  </span>
                </div>
                <p className="mt-0.5 max-w-md text-sm leading-snug text-sumi-soft">
                  {meta.blurb}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-wide text-sumi-soft/80">
                  {meta.books}
                </p>
              </div>

              <div className="sm:text-right">
                <div className="mb-2 flex items-center gap-2 sm:justify-end">
                  <LevelBadge level={meta.level} size="sm" />
                  <span className="font-mono text-[11px] text-sumi-soft">
                    {done}/{total} 課
                  </span>
                </div>
                <ProgressBar
                  value={ready ? pct : 0}
                  color={levelColor(meta.level)}
                  height={5}
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
