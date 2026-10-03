import { hydrateLesson, LEVEL_ORDER, type Lesson, type Level } from "@/lib/types";
import { advanced } from "./advanced";
import { n5 } from "./n5";

const seeds = [...n5, ...advanced];

export const lessons: Lesson[] = seeds
  .map(hydrateLesson)
  .sort(
    (a, b) =>
      LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) ||
      a.number - b.number,
  );

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function lessonsByLevel(level: Level): Lesson[] {
  return lessons.filter((l) => l.level === level);
}

export function lessonNeighbours(id: string): {
  prev?: Lesson;
  next?: Lesson;
} {
  const i = lessons.findIndex((l) => l.id === id);
  if (i === -1) return {};
  return { prev: lessons[i - 1], next: lessons[i + 1] };
}

export const levelCounts: Record<Level, number> = LEVEL_ORDER.reduce(
  (acc, level) => {
    acc[level] = lessonsByLevel(level).length;
    return acc;
  },
  {} as Record<Level, number>,
);

export const totals = {
  lessons: lessons.length,
  vocab: lessons.reduce((n, l) => n + l.vocab.length, 0),
  grammar: lessons.reduce((n, l) => n + l.grammar.length, 0),
  kanji: lessons.reduce((n, l) => n + l.kanji.length, 0),
};
