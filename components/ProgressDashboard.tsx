"use client";

import Link from "next/link";
import { lessons, lessonsByLevel } from "@/data";
import { useProgress } from "@/lib/progress";
import { LEVELS, levelColor } from "@/lib/types";
import { Hanko } from "./Hanko";
import { ProgressBar } from "./ProgressBar";

export function ProgressDashboard() {
  const { ready, state, reset } = useProgress();

  const totalLessons = lessons.length;
  const done = ready ? state.completed.length : 0;
  const pct = totalLessons ? (done / totalLessons) * 100 : 0;

  const allVocab = lessons.flatMap((l) => l.vocab);
  const learned = ready
    ? allVocab.filter((v) => (state.cards[v.id]?.box ?? 0) >= 3).length
    : 0;
  const touched = ready
    ? allVocab.filter((v) => state.cards[v.id]).length
    : 0;
  const reviews = ready
    ? Object.values(state.cards).reduce((n, c) => n + c.seen, 0)
    : 0;

  const quizEntries = ready ? Object.entries(state.quizzes) : [];

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 border border-line bg-paper p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        <div className="flex items-center gap-5">
          <Hanko size={92} label={pct >= 100 ? "皆伝" : "進捗"} animate={pct >= 100} />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-sumi-soft">
              Units complete
            </p>
            <p className="font-display text-5xl font-semibold leading-none text-sumi">
              {done}
              <span className="text-2xl text-sumi-soft">/{totalLessons}</span>
            </p>
          </div>
        </div>
        <div className="sm:pl-8 sm:border-l sm:border-line">
          <ProgressBar value={ready ? pct : 0} label="Overall progress" height={8} />
          <div className="mt-5 grid grid-cols-3 gap-4">
            <div>
              <p className="font-display text-2xl font-semibold text-sumi">
                {learned}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sumi-soft">
                words mastered
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-sumi">
                {touched}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sumi-soft">
                cards studied
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-sumi">
                {reviews}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sumi-soft">
                total reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold text-sumi">
          By level
        </h2>
        <ul className="space-y-5">
          {LEVELS.map((meta) => {
            const group = lessonsByLevel(meta.level);
            const ldone = ready
              ? group.filter((l) => state.completed.includes(l.id)).length
              : 0;
            const lpct = group.length ? (ldone / group.length) * 100 : 0;
            return (
              <li key={meta.level} className="grid items-center gap-3 sm:grid-cols-[6rem_1fr_6rem]">
                <Link
                  href={{ pathname: "/lessons", query: { level: meta.level } }}
                  className="flex items-baseline gap-2"
                >
                  <span
                    className="font-display text-2xl font-semibold"
                    style={{ color: levelColor(meta.level) }}
                  >
                    {meta.level}
                  </span>
                  <span className="font-display text-xs text-sumi-soft">
                    {meta.kana}
                  </span>
                </Link>
                <ProgressBar value={ready ? lpct : 0} color={levelColor(meta.level)} />
                <span className="font-mono text-[11px] text-sumi-soft sm:text-right">
                  {ldone}/{group.length} 課
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold text-sumi">
          Quiz results
        </h2>
        {quizEntries.length === 0 ? (
          <p className="border border-dashed border-line px-5 py-8 text-center text-sm text-sumi-soft">
            No quizzes taken yet. Open a unit and try its 試験 tab.
          </p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {quizEntries.map(([id, r]) => {
              const lesson = lessons.find((l) => l.id === id);
              const scorePct = r.total ? (r.best / r.total) * 100 : 0;
              return (
                <li
                  key={id}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/lessons/${id}`}
                      className="font-display text-base text-sumi underline-offset-4 hover:underline"
                    >
                      {lesson ? lesson.title : id}
                    </Link>
                    <p className="font-mono text-[11px] text-sumi-soft">
                      {lesson ? `${lesson.level} · ` : ""}
                      {r.attempts} attempt{r.attempts === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {scorePct >= 70 ? <Hanko size={26} label="済" /> : null}
                    <span className="font-mono text-sm text-sumi">
                      {r.best}/{r.total}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="border-t border-line pt-6">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset all progress? This cannot be undone.")) {
              reset();
            }
          }}
          className="border border-shu px-4 py-2 text-sm font-medium text-shu transition-colors hover:bg-shu hover:text-paper"
        >
          Reset all progress
        </button>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sumi-soft">
          Stored only in this browser
        </p>
      </section>
    </div>
  );
}
