import { lessons } from "@/data";
import { kanaEntries } from "@/data/kana";
import type { ProgressState } from "./progress-types";
import type { Vocab } from "./types";

const byId = new Map<string, Vocab>();
for (const lesson of lessons) {
  for (const v of lesson.vocab) byId.set(v.id, v);
}
for (const e of kanaEntries) {
  const id = `${e.script}:${e.kana}`;
  byId.set(id, {
    id,
    term: e.kana,
    reading: e.alt,
    romaji: e.romaji,
    meaning: e.romaji,
    pos: e.script,
  });
}

export function resolveCard(id: string): Vocab | undefined {
  return byId.get(id);
}

export function countDue(state: ProgressState, now = Date.now()): number {
  let n = 0;
  for (const c of Object.values(state.cards)) if (c.due <= now) n++;
  return n;
}

export function dueVocab(state: ProgressState, now = Date.now()): Vocab[] {
  return Object.entries(state.cards)
    .filter(([, c]) => c.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => byId.get(id))
    .filter((v): v is Vocab => Boolean(v))
    .slice(0, 50);
}

export function weakVocab(state: ProgressState): Vocab[] {
  return Object.entries(state.cards)
    .filter(([, c]) => c.seen >= 2 && c.box <= 1)
    .sort((a, b) => a[1].box - b[1].box || b[1].lapses - a[1].lapses)
    .map(([id]) => byId.get(id))
    .filter((v): v is Vocab => Boolean(v))
    .slice(0, 20);
}

export interface ReviewDeck {
  deck: Vocab[];
  due: number;
  weak: number;
}

export function reviewDeck(state: ProgressState, now = Date.now()): ReviewDeck {
  const due = dueVocab(state, now);
  const weak = weakVocab(state).filter((v) => !due.some((d) => d.id === v.id));
  return { deck: [...due, ...weak].slice(0, 40), due: due.length, weak: weak.length };
}
