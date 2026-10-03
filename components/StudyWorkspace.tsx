"use client";

import { useMemo, useState } from "react";
import { lessons } from "@/data";
import { LEVEL_ORDER, levelColor, type Level, type Vocab } from "@/lib/types";
import { Flashcards } from "./Flashcards";
import { KanjiPractice } from "./KanjiPractice";
import { Quiz } from "./Quiz";

type Mode = "flashcards" | "kanji" | "quiz";

const MODES: { id: Mode; kana: string; label: string }[] = [
  { id: "flashcards", kana: "暗記", label: "Flashcards" },
  { id: "kanji", kana: "漢字", label: "Kanji" },
  { id: "quiz", kana: "試験", label: "Quiz" },
];

export function StudyWorkspace({
  initialLessonId,
  initialMode,
}: {
  initialLessonId?: string;
  initialMode?: Mode;
}) {
  const [lessonId, setLessonId] = useState(
    initialLessonId && lessons.some((l) => l.id === initialLessonId)
      ? initialLessonId
      : lessons[0].id,
  );
  const [mode, setMode] = useState<Mode>(initialMode ?? "flashcards");

  const lesson = lessons.find((l) => l.id === lessonId)!;
  const pool: Vocab[] = useMemo(() => lessons.flatMap((l) => l.vocab), []);

  return (
    <div>
      <div className="grid gap-4 border border-line bg-paper p-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sumi-soft">
            Unit
          </span>
          <select
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            className="mt-1.5 w-full border border-line bg-washi px-3 py-2 font-display text-base text-sumi outline-none focus:border-ai"
          >
            {LEVEL_ORDER.map((level: Level) => {
              const group = lessons.filter((l) => l.level === level);
              if (!group.length) return null;
              return (
                <optgroup key={level} label={`${level}`}>
                  {group.map((l) => (
                    <option key={l.id} value={l.id}>
                      {String(l.number).padStart(2, "0")} · {l.title}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sumi-soft">
            Mode
          </span>
          <div className="mt-1.5 flex gap-1">
            {MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className="border px-3.5 py-2 text-sm font-medium transition-colors"
                  style={
                    active
                      ? { borderColor: "var(--color-sumi)", background: "var(--color-sumi)", color: "var(--color-paper)" }
                      : { borderColor: "var(--color-line)", color: "var(--color-sumi-soft)" }
                  }
                >
                  <span className="font-display">{m.kana}</span>
                  <span className="ml-1.5 hidden sm:inline">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-sumi-soft">
        <span
          className="inline-block h-2.5 w-2.5"
          style={{ background: levelColor(lesson.level) }}
        />
        {lesson.level} · Lesson {lesson.number} · {lesson.source}
      </div>

      <div className="mt-6">
        {mode === "flashcards" ? (
          lesson.vocab.length ? (
            <Flashcards cards={lesson.vocab} />
          ) : (
            <p className="py-16 text-center text-sm text-sumi-soft">
              No vocabulary in this unit.
            </p>
          )
        ) : null}
        {mode === "kanji" ? (
          <KanjiPractice items={lesson.kanji} />
        ) : null}
        {mode === "quiz" ? (
          lesson.vocab.length >= 2 ? (
            <Quiz key={lesson.id} lessonId={lesson.id} cards={lesson.vocab} pool={pool} />
          ) : (
            <p className="py-16 text-center text-sm text-sumi-soft">
              Not enough vocabulary for a quiz.
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}
