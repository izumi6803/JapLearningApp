import type { Metadata } from "next";
import Link from "next/link";
import { LessonCard } from "@/components/LessonCard";
import { LevelBadge } from "@/components/LevelBadge";
import { getLessons } from "@/lib/lessons/repository";
import { LEVELS, LEVEL_ORDER, lessonsOf, levelColor, type Level } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lessons",
  description: "Browse every Minna no Nihongo unit from N5 to N1.",
};

function asLevel(value: string | string[] | undefined): Level | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && (LEVEL_ORDER as string[]).includes(v) ? (v as Level) : undefined;
}

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const active = asLevel(sp.level);
  const lessons = await getLessons();
  const shown = active ? lessonsOf(lessons, active) : lessons;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
            課 · Lessons
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
            すべての課
          </h1>
          <p className="mt-2 max-w-lg text-sm text-sumi-soft">
            {shown.length} units across the N5–N1 bands. Open a unit for its
            vocabulary, grammar patterns, kanji and test.
          </p>
        </div>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filter by level">
        <Link
          href="/lessons"
          className="border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
          style={
            active
              ? { borderColor: "var(--color-line)", color: "var(--color-sumi-soft)" }
              : { borderColor: "var(--color-sumi)", background: "var(--color-sumi)", color: "var(--color-paper)" }
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
                  : { borderColor: "var(--color-line)", color: levelColor(meta.level) }
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
