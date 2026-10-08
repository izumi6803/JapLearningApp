import { lessons, lessonsByLevel } from "@/data";
import { LEVELS, type Level } from "./types";
import type { ProgressState } from "./progress-types";
import { countDue, weakVocab } from "./review";
import { computeStreak } from "./streak";

export interface StudySnapshot {
  streak: { current: number; longest: number; studiedToday: boolean };
  dueForReview: number;
  weakCount: number;
  completedLessons: number;
  totalLessons: number;
  nextLesson: { id: string; title: string; level: Level; number: number } | null;
  levelProgress: { level: Level; done: number; total: number }[];
  lastStudied: string | null;
}

export function buildSnapshot(state: ProgressState): StudySnapshot {
  const streak = computeStreak(state.activity);
  const completed = new Set(state.completed);
  const next = lessons.find((l) => !completed.has(l.id)) ?? null;

  return {
    streak: {
      current: streak.current,
      longest: streak.longest,
      studiedToday: streak.studiedToday,
    },
    dueForReview: countDue(state),
    weakCount: weakVocab(state).length,
    completedLessons: state.completed.length,
    totalLessons: lessons.length,
    nextLesson: next
      ? {
          id: next.id,
          title: next.title,
          level: next.level,
          number: next.number,
        }
      : null,
    levelProgress: LEVELS.map((meta) => {
      const group = lessonsByLevel(meta.level);
      return {
        level: meta.level,
        done: group.filter((l) => completed.has(l.id)).length,
        total: group.length,
      };
    }),
    lastStudied: state.activity.length
      ? state.activity[state.activity.length - 1]
      : null,
  };
}

/** Deterministic advice used when no LLM is configured. */
export function ruleAdvice(s: StudySnapshot): string {
  const lines: string[] = [];

  if (s.streak.current === 0) {
    lines.push(
      "Start a streak today — even 10 minutes of kana or a single flashcard deck keeps the habit alive.",
    );
  } else if (!s.streak.studiedToday) {
    lines.push(
      `Your ${s.streak.current}-day streak is at risk — a short review session keeps it going.`,
    );
  } else {
    lines.push(
      `Nice — day ${s.streak.current} of your streak is banked. (Best: ${s.streak.longest}.)`,
    );
  }

  if (s.dueForReview > 0) {
    lines.push(
      `You have ${s.dueForReview} card${s.dueForReview === 1 ? "" : "s"} due for review — clear them first so old lessons stick.`,
    );
  }

  if (s.weakCount > 0) {
    lines.push(
      `${s.weakCount} card${s.weakCount === 1 ? "" : "s"} keep slipping; give them extra reps.`,
    );
  }

  if (s.nextLesson) {
    lines.push(
      `Next up: ${s.nextLesson.level} · Lesson ${s.nextLesson.number} 「${s.nextLesson.title}」.`,
    );
  } else {
    lines.push("You have completed every unit — keep them warm with review.");
  }

  return lines.join("\n");
}
