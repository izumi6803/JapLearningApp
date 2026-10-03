"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "nihongo.progress.v1";

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

const SERVER_SNAPSHOT: ProgressState = {
  completed: [],
  cards: {},
  quizzes: {},
  updatedAt: 0,
};

let state: ProgressState = SERVER_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();

function read(): ProgressState {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<ProgressState>) : null;
    return {
      completed: parsed?.completed ?? [],
      cards: parsed?.cards ?? {},
      quizzes: parsed?.quizzes ?? {},
      updatedAt: parsed?.updatedAt ?? 0,
    };
  } catch {
    return { completed: [], cards: {}, quizzes: {}, updatedAt: 0 };
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  state = read();
  loaded = true;
}

function commit(next: ProgressState) {
  state = { ...next, updatedAt: Date.now() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ProgressState {
  ensureLoaded();
  return state;
}

function getServerSnapshot(): ProgressState {
  return SERVER_SNAPSHOT;
}

export function useProgress() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = loaded;

  const completeLesson = useCallback((lessonId: string) => {
    if (state.completed.includes(lessonId)) return;
    commit({ ...state, completed: [...state.completed, lessonId] });
  }, []);

  const recordCard = useCallback((cardId: string, correct: boolean) => {
    const prev = state.cards[cardId] ?? { box: 0, seen: 0, lapses: 0, due: 0 };
    const box = correct ? Math.min(prev.box + 1, 5) : Math.max(prev.box - 1, 0);
    const intervalsMs = [
      0,
      10 * 60e3,
      24 * 3600e3,
      3 * 24 * 3600e3,
      7 * 24 * 3600e3,
      21 * 24 * 3600e3,
    ];
    commit({
      ...state,
      cards: {
        ...state.cards,
        [cardId]: {
          box,
          seen: prev.seen + 1,
          lapses: prev.lapses + (correct ? 0 : 1),
          due: Date.now() + intervalsMs[box],
        },
      },
    });
  }, []);

  const recordQuiz = useCallback((lessonId: string, score: number, total: number) => {
    const prev = state.quizzes[lessonId];
    commit({
      ...state,
      quizzes: {
        ...state.quizzes,
        [lessonId]: {
          best: Math.max(prev?.best ?? 0, score),
          total,
          attempts: (prev?.attempts ?? 0) + 1,
        },
      },
    });
  }, []);

  const reset = useCallback(() => {
    commit({ completed: [], cards: {}, quizzes: {}, updatedAt: Date.now() });
  }, []);

  return {
    ready,
    state: current,
    isLessonComplete: (lessonId: string) => current.completed.includes(lessonId),
    cardState: (cardId: string) => current.cards[cardId],
    quizResult: (lessonId: string) => current.quizzes[lessonId],
    completeLesson,
    recordCard,
    recordQuiz,
    reset,
  };
}
