import { kanaEntries } from "@/data/kana";
import type { ProgressState } from "./progress-types";
import type { Lesson, Vocab } from "./types";

const kanaById = new Map<string, Vocab>();
for (const e of kanaEntries) {
  const id = `${e.script}:${e.kana}`;
  kanaById.set(id, {
    id,
    term: e.kana,
    reading: e.alt,
    romaji: e.romaji,
    meaning: e.romaji,
    pos: e.script,
  });
}

function indexVocab(lessons: Lesson[]): Map<string, Vocab> {
  const map = new Map<string, Vocab>();
  for (const lesson of lessons) {
    for (const v of lesson.vocab) map.set(v.id, v);
  }
  return map;
}

export function resolveCard(lessons: Lesson[], id: string): Vocab | undefined {
  for (const lesson of lessons) {
    const hit = lesson.vocab.find((v) => v.id === id);
    if (hit) return hit;
  }
  return kanaById.get(id);
}

export function countDue(state: ProgressState, now = Date.now()): number {
  let n = 0;
  for (const c of Object.values(state.cards)) if (c.due <= now) n++;
  return n;
}

export function dueVocab(
  state: ProgressState,
  lessons: Lesson[],
  now = Date.now(),
): Vocab[] {
  const index = indexVocab(lessons);
  return Object.entries(state.cards)
    .filter(([, c]) => c.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => index.get(id) ?? kanaById.get(id))
    .filter((v): v is Vocab => Boolean(v))
    .slice(0, 50);
}

export function weakVocab(state: ProgressState, lessons: Lesson[]): Vocab[] {
  const index = indexVocab(lessons);
  return Object.entries(state.cards)
    .filter(([, c]) => c.seen >= 2 && c.box <= 1)
    .sort((a, b) => a[1].box - b[1].box || b[1].lapses - a[1].lapses)
    .map(([id]) => index.get(id) ?? kanaById.get(id))
    .filter((v): v is Vocab => Boolean(v))
    .slice(0, 20);
}

export interface ReviewDeck {
  deck: Vocab[];
  due: number;
  weak: number;
}

export function reviewDeck(
  state: ProgressState,
  lessons: Lesson[],
  now = Date.now(),
): ReviewDeck {
  const due = dueVocab(state, lessons, now);
  const weak = weakVocab(state, lessons).filter(
    (v) => !due.some((d) => d.id === v.id),
  );
  return { deck: [...due, ...weak].slice(0, 40), due: due.length, weak: weak.length };
}
