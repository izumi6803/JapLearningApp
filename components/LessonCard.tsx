"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { levelColor, type Lesson } from "@/lib/types";
import { Hanko } from "./Hanko";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { ready, isLessonComplete } = useProgress();
  const complete = ready && isLessonComplete(lesson.id);
  const color = levelColor(lesson.level);

  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 border border-line bg-paper px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_30px_-18px_rgba(26,27,30,0.5)]"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <span
        aria-hidden="true"
        className="genko-cell h-11 w-11 shrink-0 font-display text-lg font-semibold"
        style={{ color }}
      >
        {String(lesson.number).padStart(2, "0")}
      </span>

      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <span className="font-display text-[17px] font-semibold leading-tight text-sumi">
            {lesson.title}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sumi-soft">
            {lesson.level}
          </span>
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[11px] text-sumi-soft">
          <span className="truncate">{lesson.titleEn}</span>
          <span aria-hidden="true" className="text-line">
            ·
          </span>
          <span>{lesson.vocab.length} 語</span>
          <span>{lesson.grammar.length} 文型</span>
          <span>{lesson.kanji.length} 漢字</span>
        </span>
      </span>

      <span className="flex items-center gap-3">
        {complete ? (
          <Hanko size={38} />
        ) : (
          <span
            aria-hidden="true"
            className="font-display text-xl leading-none text-sumi-soft transition-transform duration-200 group-hover:translate-x-0.5"
            style={{ color }}
          >
            へ
          </span>
        )}
      </span>
    </Link>
  );
}
