"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { levelColor, type Lesson } from "@/lib/types";
import { Hanko } from "./Hanko";

function Node({ lesson, status }: { lesson: Lesson; status: string }) {
  const color = levelColor(lesson.level);
  const done = status === "done";
  const current = status === "current";

  return (
    <li className="relative pl-16">
      <span
        aria-hidden="true"
        className="absolute left-4 top-1.5 h-full w-px"
        style={{ background: "var(--color-line)" }}
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 grid h-9 w-9 place-items-center border font-mono text-[11px]"
        style={{
          borderColor: color,
          background: done || current ? color : "var(--color-paper)",
          color: done || current ? "var(--color-paper)" : color,
        }}
      >
        {String(lesson.number).padStart(2, "0")}
      </span>

      <Link
        href={`/lessons/${lesson.id}`}
        className="group flex items-start justify-between gap-4 border border-line bg-paper px-4 py-3 transition-colors hover:border-sumi"
        style={current ? { borderLeftWidth: 3, borderLeftColor: color } : undefined}
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-display text-base font-semibold text-sumi">
              {lesson.title}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sumi-soft">
              {lesson.level}
            </span>
            {current ? (
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-shu">
                you are here
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block text-xs text-sumi-soft">
            {lesson.titleEn}
          </span>
        </span>
        {done ? (
          <Hanko size={30} label="済" />
        ) : (
          <span
            aria-hidden="true"
            className="font-display text-lg text-sumi-soft transition-transform group-hover:translate-x-0.5"
            style={{ color }}
          >
            へ
          </span>
        )}
      </Link>
    </li>
  );
}

export function Roadmap({ lessons }: { lessons: Lesson[] }) {
  const { ready, isLessonComplete } = useProgress();
  const currentIndex = ready
    ? lessons.findIndex((l) => !isLessonComplete(l.id))
    : -1;

  return (
    <div className="space-y-6">
      <Link
        href="/kana"
        className="flex items-center gap-4 border border-line bg-paper px-4 py-3 transition-colors hover:border-sumi"
      >
        <span className="genko-cell h-9 w-9 font-display text-lg text-ai">
          あ
        </span>
        <span>
          <span className="font-display text-base font-semibold text-sumi">
            Step 0 · 五十音 Kana
          </span>
          <span className="mt-0.5 block text-xs text-sumi-soft">
            The two syllabaries — everything else is built on these.
          </span>
        </span>
      </Link>

      <ol className="space-y-3">
        {lessons.map((lesson, i) => {
          const status =
            ready && isLessonComplete(lesson.id)
              ? "done"
              : i === currentIndex
                ? "current"
                : "upcoming";
          return <Node key={lesson.id} lesson={lesson} status={status} />;
        })}
      </ol>
    </div>
  );
}
