import type { Metadata } from "next";
import { Suspense } from "react";
import { StudyWorkspace } from "@/components/StudyWorkspace";
import { getLessons } from "@/lib/lessons/repository";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Study",
  description:
    "Drill vocabulary with flashcards, trace kanji, and take quizzes for any Minna no Nihongo unit.",
};

export default async function StudyPage() {
  const lessons = await getLessons();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          練習 · Practice
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          勉強する
        </h1>
        <p className="mt-2 max-w-lg text-sm text-sumi-soft">
          Choose a unit and a mode. Flashcards and quizzes update your progress
          as you go.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="h-64 animate-pulse border border-line bg-paper" />
        }
      >
        <StudyWorkspace lessons={lessons} />
      </Suspense>
    </div>
  );
}
