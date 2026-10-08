import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonTabs } from "@/components/LessonTabs";
import { LevelBadge } from "@/components/LevelBadge";
import { redirectAdminToConsole } from "@/lib/auth/guard";
import { getLessons } from "@/lib/lessons/repository";
import { neighboursOf, type Vocab } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lessons = await getLessons();
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return { title: "Lesson not found" };
  return {
    title: `${lesson.title} — Lesson ${lesson.number}`,
    description: `${lesson.titleEn}. ${lesson.vocab.length} words, ${lesson.grammar.length} grammar patterns and ${lesson.kanji.length} kanji from ${lesson.source}.`,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await redirectAdminToConsole();
  const { id } = await params;
  const lessons = await getLessons();
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) notFound();

  const { prev, next } = neighboursOf(lessons, id);
  const pool: Vocab[] = lessons.flatMap((l) => l.vocab);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
        <Link href="/lessons" className="transition-colors hover:text-sumi">
          Lessons
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={{ pathname: "/lessons", query: { level: lesson.level } }}
          className="transition-colors hover:text-sumi"
        >
          {lesson.level}
        </Link>
      </nav>

      <header className="mt-5 flex flex-wrap items-start gap-5">
        <span
          aria-hidden="true"
          className="genko-cell h-20 w-20 shrink-0 font-display text-3xl font-semibold"
          style={{ color: "var(--color-sumi)" }}
        >
          {String(lesson.number).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <LevelBadge level={lesson.level} />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sumi-soft">
              {lesson.source}
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-sumi sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-1 text-sm text-sumi-soft">{lesson.titleEn}</p>
        </div>
      </header>

      <LessonTabs lesson={lesson} pool={pool} />

      <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/lessons/${prev.id}`}
            className="group border border-line px-4 py-3 transition-colors hover:border-sumi"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sumi-soft">
              ← Previous
            </span>
            <span className="mt-1 block font-display text-base text-sumi">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/lessons/${next.id}`}
            className="group border border-line px-4 py-3 text-right transition-colors hover:border-sumi sm:col-start-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sumi-soft">
              Next →
            </span>
            <span className="mt-1 block font-display text-base text-sumi">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
