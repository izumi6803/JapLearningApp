import { describe, expect, it } from "vitest";
import { computeStreak } from "./streak";

describe("computeStreak", () => {
  const now = new Date(2026, 5, 10, 12, 0, 0);

  it("returns an empty streak for no activity", () => {
    expect(computeStreak([], now)).toEqual({
      current: 0,
      longest: 0,
      studiedToday: false,
      total: 0,
      lastDay: null,
    });
  });

  it("counts a run that ends today", () => {
    const info = computeStreak(["2026-06-08", "2026-06-09", "2026-06-10"], now);
    expect(info.current).toBe(3);
    expect(info.longest).toBe(3);
    expect(info.studiedToday).toBe(true);
    expect(info.total).toBe(3);
  });

  it("keeps the streak alive when the last day was yesterday", () => {
    const info = computeStreak(["2026-06-08", "2026-06-09"], now);
    expect(info.current).toBe(2);
    expect(info.studiedToday).toBe(false);
  });

  it("breaks the current streak after a gap of two days", () => {
    const info = computeStreak(["2026-06-05", "2026-06-06", "2026-06-07"], now);
    expect(info.current).toBe(0);
    expect(info.longest).toBe(3);
    expect(info.lastDay).toBe("2026-06-07");
  });

  it("finds the longest historical run across gaps", () => {
    const info = computeStreak(
      ["2026-05-01", "2026-05-02", "2026-05-03", "2026-05-06", "2026-06-10"],
      now,
    );
    expect(info.longest).toBe(3);
    expect(info.current).toBe(1);
  });

  it("ignores duplicate days", () => {
    const info = computeStreak(["2026-06-10", "2026-06-10", "2026-06-09"], now);
    expect(info.total).toBe(2);
    expect(info.current).toBe(2);
  });
});
