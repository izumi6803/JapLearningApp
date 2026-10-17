import type { Metadata } from "next";
import { Suspense } from "react";
import { LessonBrowser } from "@/components/LessonBrowser";
import { getLessons } from "@/lib/lessons/repository";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Lessons",
  description: "Browse every Minna no Nihongo unit from N5 to N1.",
};

function Fallback() {
  return (
    <div className="mt-10 space-y-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse border border-line bg-paper" />
      ))}
    </div>
  );
}

export default async function LessonsPage() {
  const lessons = await getLessons();

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
            {lessons.length} units across the N5–N1 bands. Open a unit for its
            vocabulary, grammar patterns, kanji and test.
          </p>
        </div>
      </header>

      <Suspense fallback={<Fallback />}>
        <LessonBrowser lessons={lessons} />
      </Suspense>
    </div>
  );
}
