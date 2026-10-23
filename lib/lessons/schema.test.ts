import { describe, expect, it } from "vitest";
import { sanitizeLessonSeed } from "./schema";

const base = { id: "l1", level: "N5" as const, number: 1 };

describe("sanitizeLessonSeed", () => {
  it("keeps identity fields and trims text", () => {
    const seed = sanitizeLessonSeed(
      { title: "  Hello  ", titleEn: " Hi ", source: " book " },
      base,
    );
    expect(seed).toMatchObject({
      id: "l1",
      level: "N5",
      number: 1,
      title: "Hello",
      titleEn: "Hi",
      source: "book",
    });
  });

  it("falls back to the lesson id for an empty title", () => {
    expect(sanitizeLessonSeed({ title: "   " }, base).title).toBe("l1");
    expect(sanitizeLessonSeed(null, base).title).toBe("l1");
  });

  it("filters invalid vocab and clamps field lengths", () => {
    const seed = sanitizeLessonSeed(
      {
        vocab: [
          null,
          "nope",
          { term: "", meaning: "" },
          { term: "  a  ", meaning: " b " },
          { term: "x".repeat(200), meaning: "y".repeat(400) },
        ],
      },
      base,
    );
    expect(seed.vocab).toHaveLength(2);
    expect(seed.vocab[0]).toMatchObject({ term: "a", meaning: "b" });
    expect(seed.vocab[1].term).toHaveLength(120);
    expect(seed.vocab[1].meaning).toHaveLength(240);
  });

  it("keeps examples only when they have content", () => {
    const seed = sanitizeLessonSeed(
      {
        vocab: [
          { term: "a", example: { jp: "a", en: "b", reading: "r" } },
          { term: "b", example: { jp: "", en: "", reading: "r" } },
        ],
      },
      base,
    );
    expect(seed.vocab[0].example).toEqual({ jp: "a", en: "b", reading: "r" });
    expect(seed.vocab[1].example).toBeUndefined();
  });

  it("requires a grammar point and clamps explanations", () => {
    const seed = sanitizeLessonSeed(
      {
        grammar: [
          { point: "", meaning: "x" },
          { point: " は ", explanation: "e".repeat(2_000) },
        ],
      },
      base,
    );
    expect(seed.grammar).toHaveLength(1);
    expect(seed.grammar[0].point).toBe("は");
    expect(seed.grammar[0].explanation).toHaveLength(1_200);
  });

  it("normalises kanji entries", () => {
    const seed = sanitizeLessonSeed(
      {
        kanji: [
          { char: " 日 ", on: ["ニチ"], kun: ["ひ"], meaning: "day", strokes: 4 },
          { char: "", meaning: "empty" },
          { char: "x".repeat(20), strokes: -5 },
        ],
      },
      base,
    );
    expect(seed.kanji).toHaveLength(2);
    expect(seed.kanji[0]).toMatchObject({
      char: "日",
      on: ["ニチ"],
      kun: ["ひ"],
      meaning: "day",
      strokes: 4,
    });
    expect(seed.kanji[1].char).toHaveLength(8);
    expect(seed.kanji[1].strokes).toBe(0);
  });
});
