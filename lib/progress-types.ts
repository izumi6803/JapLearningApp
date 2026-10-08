export interface CardState {
  box: number;
  seen: number;
  lapses: number;
  due: number;
}

export interface QuizResult {
  best: number;
  total: number;
  attempts: number;
}

export interface ProgressState {
  completed: string[];
  cards: Record<string, CardState>;
  quizzes: Record<string, QuizResult>;
  /** Local calendar days (YYYY-MM-DD) on which the student studied. */
  activity: string[];
  updatedAt: number;
}

export const EMPTY_PROGRESS: ProgressState = {
  completed: [],
  cards: {},
  quizzes: {},
  activity: [],
  updatedAt: 0,
};

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addStudyDay(activity: string[], day: string): string[] {
  if (activity.includes(day)) return activity;
  return [...activity, day].sort().slice(-400);
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function sanitizeProgress(input: unknown): ProgressState {
  if (!input || typeof input !== "object") return EMPTY_PROGRESS;
  const raw = input as Record<string, unknown>;

  const completed = Array.isArray(raw.completed)
    ? raw.completed.filter((c): c is string => typeof c === "string").slice(0, 2000)
    : [];

  const cards: Record<string, CardState> = {};
  if (raw.cards && typeof raw.cards === "object") {
    for (const [key, value] of Object.entries(raw.cards as Record<string, unknown>)) {
      if (!value || typeof value !== "object") continue;
      const c = value as Record<string, unknown>;
      cards[key] = {
        box: Math.max(0, Math.min(5, num(c.box))),
        seen: Math.max(0, num(c.seen)),
        lapses: Math.max(0, num(c.lapses)),
        due: num(c.due),
      };
    }
  }

  const quizzes: Record<string, QuizResult> = {};
  if (raw.quizzes && typeof raw.quizzes === "object") {
    for (const [key, value] of Object.entries(raw.quizzes as Record<string, unknown>)) {
      if (!value || typeof value !== "object") continue;
      const q = value as Record<string, unknown>;
      quizzes[key] = {
        best: Math.max(0, num(q.best)),
        total: Math.max(0, num(q.total)),
        attempts: Math.max(0, num(q.attempts)),
      };
    }
  }

  const activity = Array.isArray(raw.activity)
    ? Array.from(
        new Set(
          raw.activity.filter(
            (d): d is string => typeof d === "string" && DAY_RE.test(d),
          ),
        ),
      )
        .sort()
        .slice(-400)
    : [];

  return { completed, cards, quizzes, activity, updatedAt: num(raw.updatedAt) };
}

export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const completed = Array.from(new Set([...a.completed, ...b.completed]));

  const cards: Record<string, CardState> = {};
  for (const id of new Set([...Object.keys(a.cards), ...Object.keys(b.cards)])) {
    const x = a.cards[id];
    const y = b.cards[id];
    if (!x) cards[id] = y;
    else if (!y) cards[id] = x;
    else
      cards[id] = {
        box: Math.max(x.box, y.box),
        seen: Math.max(x.seen, y.seen),
        lapses: Math.max(x.lapses, y.lapses),
        due: Math.max(x.due, y.due),
      };
  }

  const quizzes: Record<string, QuizResult> = {};
  for (const id of new Set([...Object.keys(a.quizzes), ...Object.keys(b.quizzes)])) {
    const x = a.quizzes[id];
    const y = b.quizzes[id];
    if (!x) quizzes[id] = y;
    else if (!y) quizzes[id] = x;
    else
      quizzes[id] = {
        best: Math.max(x.best, y.best),
        total: Math.max(x.total, y.total),
        attempts: Math.max(x.attempts, y.attempts),
      };
  }

  const activity = Array.from(new Set([...a.activity, ...b.activity]))
    .sort()
    .slice(-400);

  return {
    completed,
    cards,
    quizzes,
    activity,
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  };
}
