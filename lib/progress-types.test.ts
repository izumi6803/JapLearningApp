import { describe, expect, it } from "vitest";
import {
  EMPTY_PROGRESS,
  addStudyDay,
  mergeProgress,
  sanitizeProgress,
  todayKey,
  type ProgressState,
} from "./progress-types";

describe("todayKey", () => {
  it("formats local dates as YYYY-MM-DD with zero padding", () => {
    expect(todayKey(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(todayKey(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});

describe("addStudyDay", () => {
  it("adds a new day and keeps the list sorted", () => {
    expect(addStudyDay(["2026-01-02"], "2026-01-01")).toEqual([
      "2026-01-01",
      "2026-01-02",
    ]);
  });

  it("is idempotent for an existing day", () => {
    const days = ["2026-01-01", "2026-01-02"];
    expect(addStudyDay(days, "2026-01-01")).toBe(days);
  });

  it("caps history at the 400 most recent days", () => {
    const days = Array.from({ length: 400 }, (_, i) =>
      new Date(Date.UTC(2025, 0, 1 + i)).toISOString().slice(0, 10),
    );
    const next = addStudyDay(days, "2026-06-01");
    expect(next).toHaveLength(400);
    expect(next.at(-1)).toBe("2026-06-01");
    expect(next).not.toContain(days[0]);
  });
});

describe("sanitizeProgress", () => {
  it("returns the empty state for non-objects", () => {
    expect(sanitizeProgress(null)).toEqual(EMPTY_PROGRESS);
    expect(sanitizeProgress("nope")).toEqual(EMPTY_PROGRESS);
  });

  it("drops invalid entries and clamps card values", () => {
    const state = sanitizeProgress({
      completed: ["l1", 42, null, "l2"],
      cards: {
        v1: { box: 9, seen: -3, lapses: 2.6, due: 123 },
        v2: { box: 0, seen: 1, lapses: 0, due: 0 },
        broken: null,
      },
      quizzes: { q1: { best: -1, total: 10, attempts: 2 } },
      activity: ["2026-01-02", "2026-01-02", "bad", "2026-01-01"],
      updatedAt: 99,
    });

    expect(state.completed).toEqual(["l1", "l2"]);
    expect(state.cards.v1).toEqual({ box: 5, seen: 0, lapses: 2.6, due: 123 });
    expect(state.cards.v2).toEqual({ box: 0, seen: 1, lapses: 0, due: 0 });
    expect(state.cards).not.toHaveProperty("broken");
    expect(state.quizzes.q1).toEqual({ best: 0, total: 10, attempts: 2 });
    expect(state.activity).toEqual(["2026-01-01", "2026-01-02"]);
    expect(state.updatedAt).toBe(99);
  });
});

describe("mergeProgress", () => {
  it("unions lists and keeps the best value per card and quiz", () => {
    const a: ProgressState = {
      completed: ["l1"],
      cards: { v1: { box: 1, seen: 5, lapses: 0, due: 10 } },
      quizzes: { q1: { best: 3, total: 10, attempts: 1 } },
      activity: ["2026-01-01"],
      updatedAt: 10,
    };
    const b: ProgressState = {
      completed: ["l2"],
      cards: {
        v1: { box: 3, seen: 2, lapses: 1, due: 20 },
        v2: { box: 0, seen: 1, lapses: 0, due: 5 },
      },
      quizzes: { q1: { best: 8, total: 10, attempts: 2 } },
      activity: ["2026-01-02"],
      updatedAt: 20,
    };

    const merged = mergeProgress(a, b);
    expect(merged.completed.sort()).toEqual(["l1", "l2"]);
    expect(merged.cards.v1).toEqual({ box: 3, seen: 5, lapses: 1, due: 20 });
    expect(merged.cards.v2).toEqual({ box: 0, seen: 1, lapses: 0, due: 5 });
    expect(merged.quizzes.q1).toEqual({ best: 8, total: 10, attempts: 2 });
    expect(merged.activity).toEqual(["2026-01-01", "2026-01-02"]);
    expect(merged.updatedAt).toBe(20);
  });
});
