"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { lessons } from "@/data";
import { useProgress } from "@/lib/progress";
import { countDue } from "@/lib/review";
import { computeStreak } from "@/lib/streak";

type Href = ComponentProps<typeof Link>["href"];

interface Task {
  done: boolean;
  label: string;
  note: string;
  href: Href;
  cta: string;
}

export function TodayPlan() {
  const { ready, state, isLessonComplete } = useProgress();

  if (!ready) {
    return <div className="h-40 animate-pulse border border-line bg-paper" />;
  }

  const due = countDue(state);
  const streak = computeStreak(state.activity);
  const next = lessons.find((l) => !isLessonComplete(l.id)) ?? null;

  const tasks: Task[] = [
    {
      done: streak.studiedToday,
      label: streak.studiedToday
        ? `Streak banked — day ${streak.current}`
        : streak.current > 0
          ? `Keep your ${streak.current}-day streak alive`
          : "Start a streak today",
      note: streak.studiedToday
        ? "Come back tomorrow to extend it."
        : "Even one short session counts.",
      href: next ? `/lessons/${next.id}` : { pathname: "/study" },
      cta: streak.studiedToday ? "Study" : "Start",
    },
    {
      done: due === 0,
      label:
        due === 0
          ? "No cards due — all caught up"
          : `Review ${due} card${due === 1 ? "" : "s"} from earlier lessons`,
      note:
        due === 0
          ? "Spaced repetition will bring more back later."
          : "Old material is fading — clear them now.",
      href: { pathname: "/review" },
      cta: "Review",
    },
    {
      done: false,
      label: next
        ? `Continue ${next.level} · Lesson ${next.number}「${next.title}」`
        : "Every unit is complete — keep them warm",
      note: next
        ? next.titleEn
        : "Review rotations keep everything sharp.",
      href: next ? `/lessons/${next.id}` : { pathname: "/lessons" },
      cta: "Open",
    },
    {
      done: false,
      label: "Speak for five minutes with the AI partner",
      note: "Roleplay a real scene and get corrections.",
      href: { pathname: "/tutor", query: { mode: "conversation" } },
      cta: "Talk",
    },
  ];

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-sumi">
          Today’s plan
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-sumi-soft">
          {remaining === 0 ? "All done" : `${remaining} to go`}
        </span>
      </div>

      <ul className="divide-y divide-line border-y border-line">
        {tasks.map((task, i) => (
          <li
            key={i}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3.5"
          >
            <span
              aria-hidden="true"
              className="grid h-6 w-6 place-items-center rounded-full border text-[11px]"
              style={{
                borderColor: task.done
                  ? "var(--color-matcha)"
                  : "var(--color-line)",
                background: task.done ? "var(--color-matcha)" : "transparent",
                color: task.done ? "var(--color-paper)" : "transparent",
              }}
            >
              ✓
            </span>

            <span className="min-w-0">
              <span
                className="block font-display text-[15px] leading-snug"
                style={{
                  color: task.done
                    ? "var(--color-sumi-soft)"
                    : "var(--color-sumi)",
                  textDecoration: task.done ? "line-through" : "none",
                }}
              >
                {task.label}
              </span>
              <span className="mt-0.5 block text-xs text-sumi-soft">
                {task.note}
              </span>
            </span>

            <Link
              href={task.href}
              className="shrink-0 border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-sumi"
            >
              {task.cta}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
