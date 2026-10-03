"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress";
import type { Vocab } from "@/lib/types";
import { Hanko } from "./Hanko";
import { ProgressBar } from "./ProgressBar";
import { SpeakButton } from "./SpeakButton";

type QType = "meaning" | "term" | "reading";

interface Question {
  id: string;
  type: QType;
  prompt: string;
  note?: string;
  speak?: string;
  answer: string;
  options: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function buildQuestions(
  cards: Vocab[],
  pool: Vocab[],
  count: number,
): Question[] {
  const types: QType[] = ["meaning", "term", "reading"];
  const picked = shuffle(cards).slice(0, Math.min(count, cards.length));

  return picked.map((v) => {
    const type = types[Math.floor(Math.random() * types.length)];
    let prompt: string;
    let note: string | undefined;
    let speak: string | undefined;
    let answer: string;
    let field: keyof Vocab;

    if (type === "meaning") {
      prompt = v.term;
      note = v.reading;
      speak = v.term;
      answer = v.meaning;
      field = "meaning";
    } else if (type === "term") {
      prompt = v.meaning;
      answer = v.term;
      field = "term";
    } else {
      prompt = v.term;
      speak = v.term;
      answer = v.reading;
      field = "reading";
    }

    const distractors = shuffle(
      pool.filter((p) => p.id !== v.id && String(p[field]) !== answer),
    )
      .slice(0, 3)
      .map((p) => String(p[field]));

    return {
      id: v.id,
      type,
      prompt,
      note,
      speak,
      answer,
      options: shuffle([answer, ...distractors]),
    };
  });
}

const TYPE_LABEL: Record<QType, string> = {
  meaning: "Choose the meaning",
  term: "Choose the Japanese",
  reading: "Choose the reading",
};

export function Quiz({
  lessonId,
  cards,
  pool,
  count = 10,
}: {
  lessonId: string;
  cards: Vocab[];
  pool?: Vocab[];
  count?: number;
}) {
  const { recordQuiz, completeLesson } = useProgress();
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildQuestions(cards, pool ?? cards, count),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-sumi-soft">
        Not enough vocabulary to build a quiz.
      </p>
    );
  }

  const total = questions.length;
  const q = questions[index];
  const answered = selected !== null;

  const choose = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= total) {
      const finalScore = score;
      recordQuiz(lessonId, finalScore, total);
      if (finalScore / total >= 0.7) completeLesson(lessonId);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 70;
    return (
      <div className="flex flex-col items-center border border-line bg-paper px-6 py-14 text-center">
        {passed ? (
          <Hanko size={80} label="合格" animate />
        ) : (
          <span className="font-display text-5xl text-sumi">もう一度</span>
        )}
        <h3 className="mt-6 font-display text-3xl font-semibold text-sumi">
          {score} / {total}
        </h3>
        <p className="mt-1 text-sm text-sumi-soft">
          {passed
            ? "Unit marked complete — the seal is yours."
            : "You need 70% to pass. Review the unit and try once more."}
        </p>
        <button
          type="button"
          onClick={() => {
            setQuestions(buildQuestions(cards, pool ?? cards, count));
            setIndex(0);
            setSelected(null);
            setScore(0);
            setDone(false);
          }}
          className="mt-7 border border-sumi px-5 py-2 text-sm font-medium transition-colors hover:bg-sumi hover:text-paper"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar
        value={(index / total) * 100}
        label={`Question ${index + 1} of ${total}`}
      />

      <div className="mt-6 border border-line bg-paper px-6 py-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-sumi-soft">
          {TYPE_LABEL[q.type]}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span
            className={`font-display font-semibold leading-tight text-sumi ${
              q.type === "term" ? "text-2xl" : "text-4xl"
            }`}
          >
            {q.prompt}
          </span>
          {q.speak ? <SpeakButton text={q.speak} /> : null}
        </div>
        {q.note ? (
          <p className="mt-2 font-mono text-xs text-ai">{q.note}</p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {q.options.map((opt) => {
          const isAnswer = opt === q.answer;
          const isChosen = opt === selected;
          let border = "var(--color-line)";
          let bg = "transparent";
          const color = "var(--color-sumi)";
          if (answered && isAnswer) {
            border = "var(--color-matcha)";
            bg = "rgba(95,125,70,0.10)";
          } else if (answered && isChosen) {
            border = "var(--color-shu)";
            bg = "rgba(192,54,44,0.10)";
          }
          return (
            <button
              key={opt}
              type="button"
              onClick={() => choose(opt)}
              disabled={answered}
              className="flex items-center justify-between gap-3 border px-4 py-3.5 text-left text-[15px] transition-all disabled:cursor-default"
              style={{ borderColor: border, background: bg, color }}
            >
              <span className="font-display">{opt}</span>
              {answered && isAnswer ? (
                <span className="font-mono text-[11px] text-matcha">正解</span>
              ) : null}
              {answered && isChosen && !isAnswer ? (
                <span className="font-mono text-[11px] text-shu">×</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={next}
          disabled={!answered}
          className="border border-sumi bg-sumi px-6 py-2.5 text-sm font-medium text-paper transition-opacity disabled:opacity-30"
        >
          {index + 1 >= total ? "See result" : "Next question"}
        </button>
      </div>
    </div>
  );
}
