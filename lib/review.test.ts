import { describe, expect, it } from "vitest";
import { kanaEntries } from "@/data/kana";
import type { ProgressState } from "./progress-types";
import { countDue, dueVocab, resolveCard, reviewDeck, weakVocab } from "./review";
import type { Lesson, Vocab } from "./types";

function vocab(id: string, term: string): Vocab {
  return { id, term, reading: term, romaji: term, meaning: term };
}

const lessons: Lesson[] = [
  {
    id: "l1",
    level: "N5",
    number: 1,
    title: "One",
    titleEn: "One",
    source: "",
    vocab: [vocab("v1", "one"), vocab("v2", "two")],
    grammar: [],
    kanji: [],
  },
  {
    id: "l2",
    level: "N5",
    number: 2,
    title: "Two",
    titleEn: "Two",
    source: "",
    vocab: [vocab("v3", "three")],
    grammar: [],
    kanji: [],
  },
];

function state(cards: ProgressState["cards"]): ProgressState {
  return { completed: [], cards, quizzes: {}, activity: [], updatedAt: 0 };
}

describe("resolveCard", () => {
  it("finds a vocab entry across lessons", () => {
    expect(resolveCard(lessons, "v2")?.term).toBe("two");
    expect(resolveCard(lessons, "v3")?.term).toBe("three");
  });

  it("falls back to kana entries", () => {
    const entry = kanaEntries[0];
    const card = resolveCard([], `${entry.script}:${entry.kana}`);
    expect(card).toMatchObject({
      term: entry.kana,
      reading: entry.alt,
      romaji: entry.romaji,
      pos: entry.script,
    });
  });

  it("returns undefined for unknown ids", () => {
    expect(resolveCard(lessons, "ghost")).toBeUndefined();
  });
});

describe("countDue", () => {
  it("counts every card whose due time has passed", () => {
    const now = 1_000;
    const s = state({
      v1: { box: 0, seen: 1, lapses: 0, due: 999 },
      v2: { box: 0, seen: 1, lapses: 0, due: 1_000 },
      v3: { box: 0, seen: 1, lapses: 0, due: 1_001 },
      ghost: { box: 0, seen: 1, lapses: 0, due: 0 },
    });
    expect(countDue(s, now)).toBe(3);
  });
});

describe("dueVocab", () => {
  it("returns due cards in ascending due order", () => {
    const now = 1_000;
    const s = state({
      v3: { box: 0, seen: 1, lapses: 0, due: 900 },
      v1: { box: 0, seen: 1, lapses: 0, due: 100 },
      v2: { box: 0, seen: 1, lapses: 0, due: 1_500 },
    });
    expect(dueVocab(s, lessons, now).map((v) => v.id)).toEqual(["v1", "v3"]);
  });

  it("drops cards that no longer resolve to content", () => {
    const now = 1_000;
    const s = state({ ghost: { box: 0, seen: 1, lapses: 0, due: 0 } });
    expect(dueVocab(s, lessons, now)).toEqual([]);
  });
});

describe("weakVocab", () => {
  it("keeps seen cards with a low box, ordered by box then lapses", () => {
    const s = state({
      v1: { box: 1, seen: 5, lapses: 0, due: 0 },
      v2: { box: 0, seen: 3, lapses: 2, due: 0 },
      v3: { box: 2, seen: 9, lapses: 4, due: 0 },
    });
    expect(weakVocab(s, lessons).map((v) => v.id)).toEqual(["v2", "v1"]);
  });
});

describe("reviewDeck", () => {
  it("puts due cards first and avoids duplicates", () => {
    const now = 1_000;
    const s = state({
      v1: { box: 0, seen: 4, lapses: 3, due: 0 },
      v2: { box: 0, seen: 4, lapses: 1, due: 500 },
      v3: { box: 0, seen: 1, lapses: 0, due: 9_999 },
    });
    const deck = reviewDeck(s, lessons, now);
    expect(deck.due).toBe(2);
    expect(deck.weak).toBe(0);
    expect(deck.deck.map((v) => v.id)).toEqual(["v1", "v2"]);
  });

  it("adds weak cards that are not already due", () => {
    const now = 1_000;
    const s = state({
      v1: { box: 0, seen: 4, lapses: 1, due: 5_000 },
      v2: { box: 0, seen: 4, lapses: 1, due: 0 },
    });
    const deck = reviewDeck(s, lessons, now);
    expect(deck.due).toBe(1);
    expect(deck.weak).toBe(1);
    expect(deck.deck.map((v) => v.id)).toEqual(["v2", "v1"]);
  });
});
