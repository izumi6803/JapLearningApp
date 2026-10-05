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
  updatedAt: number;
}

export const EMPTY_PROGRESS: ProgressState = {
  completed: [],
  cards: {},
  quizzes: {},
  updatedAt: 0,
};

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

  return { completed, cards, quizzes, updatedAt: num(raw.updatedAt) };
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

  return {
    completed,
    cards,
    quizzes,
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  };
}
