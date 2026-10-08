import { todayKey } from "./progress-types";

export interface StreakInfo {
  current: number;
  longest: number;
  studiedToday: boolean;
  total: number;
  lastDay: string | null;
}

function dayOffset(a: string, b: string): number {
  const da = Date.parse(`${a}T00:00:00`);
  const db = Date.parse(`${b}T00:00:00`);
  return Math.round((db - da) / 86_400_000);
}

export function computeStreak(activity: string[], now = new Date()): StreakInfo {
  const days = Array.from(new Set(activity)).sort();
  const total = days.length;
  const lastDay = days.length ? days[days.length - 1] : null;
  const today = todayKey(now);

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of days) {
    run = prev && dayOffset(prev, d) === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = d;
  }

  let current = 0;
  if (lastDay) {
    const gap = dayOffset(lastDay, today);
    if (gap === 0 || gap === 1) {
      current = 1;
      for (let i = days.length - 1; i > 0; i--) {
        if (dayOffset(days[i - 1], days[i]) === 1) current++;
        else break;
      }
    }
  }

  return { current, longest, studiedToday: lastDay === today, total, lastDay };
}
