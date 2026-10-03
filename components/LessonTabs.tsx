"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress";
import type { Lesson, Vocab } from "@/lib/types";
import { Flashcards } from "./Flashcards";
import { GrammarList } from "./GrammarList";
import { Hanko } from "./Hanko";
import { KanjiPractice } from "./KanjiPractice";
import { Quiz } from "./Quiz";
import { VocabTable } from "./VocabTable";

type TabId = "vocab" | "grammar" | "kanji" | "cards" | "quiz";

export function LessonTabs({
  lesson,
  pool,
}: {
  lesson: Lesson;
  pool: Vocab[];
}) {
  const [tab, setTab] = useState<TabId>("vocab");
  const { ready, isLessonComplete, completeLesson } = useProgress();
  const complete = ready && isLessonComplete(lesson.id);

  const tabs: { id: TabId; kana: string; label: string; count?: number }[] = [
    { id: "vocab", kana: "単語", label: "Vocabulary", count: lesson.vocab.length },
    { id: "grammar", kana: "文法", label: "Grammar", count: lesson.grammar.length },
    { id: "kanji", kana: "漢字", label: "Kanji", count: lesson.kanji.length },
    { id: "cards", kana: "暗記", label: "Flashcards" },
    { id: "quiz", kana: "試験", label: "Quiz" },
  ];

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4 border-y border-line bg-paper px-4 py-3">
        <div className="flex items-center gap-3">
          {complete ? (
            <Hanko size={34} label="済" />
          ) : (
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full border border-sumi-soft/50"
            />
          )}
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
            {complete ? "Unit complete" : "Not yet studied"}
          </p>
        </div>
        {!complete ? (
          <button
            type="button"
            onClick={() => completeLesson(lesson.id)}
            className="border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-sumi"
          >
            Mark as studied
          </button>
        ) : null}
      </div>

      <div
        role="tablist"
        aria-label="Lesson sections"
        className="mt-6 flex gap-1 overflow-x-auto border-b border-line"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className="relative shrink-0 px-4 py-2.5 text-sm transition-colors"
              style={{ color: active ? "var(--color-sumi)" : "var(--color-sumi-soft)" }}
            >
              <span className="font-display">{t.kana}</span>
              <span className="ml-2 hidden font-medium sm:inline">{t.label}</span>
              {typeof t.count === "number" ? (
                <span className="ml-1.5 font-mono text-[10px] text-sumi-soft">
                  {t.count}
                </span>
              ) : null}
              <span
                aria-hidden="true"
                className="absolute inset-x-2 -bottom-px h-[2px] origin-left transition-transform duration-300"
                style={{
                  backgroundColor: "var(--color-shu)",
                  transform: active ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="py-8">
        {tab === "vocab" ? <VocabTable items={lesson.vocab} /> : null}
        {tab === "grammar" ? <GrammarList items={lesson.grammar} /> : null}
        {tab === "kanji" ? <KanjiPractice items={lesson.kanji} /> : null}
        {tab === "cards" ? (
          lesson.vocab.length ? (
            <Flashcards cards={lesson.vocab} />
          ) : (
            <p className="py-16 text-center text-sm text-sumi-soft">
              This unit has no vocabulary cards.
            </p>
          )
        ) : null}
        {tab === "quiz" ? (
          lesson.vocab.length >= 2 ? (
            <Quiz key={lesson.id} lessonId={lesson.id} cards={lesson.vocab} pool={pool} />
          ) : (
            <p className="py-16 text-center text-sm text-sumi-soft">
              This unit does not have enough vocabulary for a quiz.
            </p>
          )
        ) : null}
      </div>
    </section>
  );
}
