import type { Metadata } from "next";
import { StudyWorkspace } from "@/components/StudyWorkspace";

export const metadata: Metadata = {
  title: "Study",
  description:
    "Drill vocabulary with flashcards, trace kanji, and take quizzes for any Minna no Nihongo unit.",
};

type Mode = "flashcards" | "kanji" | "quiz";

function pick<T extends string>(value: string | string[] | undefined, allowed: T[]) {
  const v = Array.isArray(value) ? value[0] : value;
  return v && (allowed as string[]).includes(v) ? (v as T) : undefined;
}

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const initialLessonId = Array.isArray(sp.lesson) ? sp.lesson[0] : sp.lesson;
  const initialMode = pick<Mode>(sp.mode, ["flashcards", "kanji", "quiz"]);

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

      <StudyWorkspace
        initialLessonId={initialLessonId}
        initialMode={initialMode}
      />
    </div>
  );
}
