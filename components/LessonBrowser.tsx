"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LessonCard } from "./LessonCard";
import { LevelBadge } from "./LevelBadge";
import {
  LEVELS,
  LEVEL_ORDER,
  lessonsOf,
  levelColor,
  type Lesson,
  type Level,
} from "@/lib/types";

function asLevel(value: string | null): Level | undefined {
  return value && (LEVEL_ORDER as string[]).includes(value)
    ? (value as Level)
    : undefined;
}

export function LessonBrowser({ lessons }: { lessons: Lesson[] }) {
  const params = useSearchParams();
  const active = asLevel(params.get("level"));
  const shown = active ? lessonsOf(lessons, active) : lessons;

  return (
    <div>
      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filter by level">
        <Link
          href="/lessons"
          className="border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
          style={
            active
              ? {
                  borderColor: "var(--color-line)",
                  color: "var(--color-sumi-soft)",
                }
              : {
                  borderColor: "var(--color-sumi)",
                  background: "var(--color-sumi)",
                  color: "var(--color-paper)",
                }
          }
        >
          All
        </Link>
        {LEVELS.map((meta) => {
          const isActive = active === meta.level;
          return (
            <Link
              key={meta.level}
              href={{ pathname: "/lessons", query: { level: meta.level } }}
              className="border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
              style={
                isActive
                  ? {
                      borderColor: levelColor(meta.level),
                      background: levelColor(meta.level),
                      color: "var(--color-paper)",
                    }
                  : {
                      borderColor: "var(--color-line)",
                      color: levelColor(meta.level),
                    }
              }
            >
              {meta.level} · {meta.name}
            </Link>
          );
        })}
      </nav>

      {active ? (
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3 border-b border-line pb-3">
            <LevelBadge level={active} />
            <h2 className="font-display text-xl font-semibold text-sumi">
              {LEVELS.find((l) => l.level === active)?.name}
            </h2>
          </div>
          <div className="grid gap-2.5">
            {shown.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-10 space-y-12">
          {LEVEL_ORDER.map((level) => {
            const group = lessonsOf(lessons, level);
            if (!group.length) return null;
            return (
              <section key={level}>
                <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-3">
                  <span
                    className="font-display text-2xl font-semibold leading-none"
                    style={{ color: levelColor(level) }}
                  >
                    {level}
                  </span>
                  <h2 className="font-display text-lg font-semibold text-sumi">
                    {LEVELS.find((l) => l.level === level)?.name}
                  </h2>
                  <span className="ml-auto font-mono text-[11px] text-sumi-soft">
                    {group.length} 課
                  </span>
                </div>
                <div className="grid gap-2.5">
                  {group.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
