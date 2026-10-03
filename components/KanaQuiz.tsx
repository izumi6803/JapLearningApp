"use client";

import { useState } from "react";
import { kanaOf, type KanaEntry, type KanaScript } from "@/data/kana";
import { useProgress } from "@/lib/progress";
import { Hanko } from "./Hanko";
import { ProgressBar } from "./ProgressBar";
import { SpeakButton } from "./SpeakButton";

type Dir = "k2r" | "r2k";

interface KQuestion {
  id: string;
  entry: KanaEntry;
  dir: Dir;
  prompt: string;
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

function distractors<T>(all: T[], correct: T, n = 3): T[] {
  const seen = new Set<T>([correct]);
  const out: T[] = [];
  for (const v of shuffle(all)) {
    if (out.length >= n) break;
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

function build(entries: KanaEntry[]): KQuestion[] {
  const picked = shuffle(entries).slice(0, Math.min(12, entries.length));
  return picked.map((e) => {
    const dir: Dir = Math.random() < 0.5 ? "k2r" : "r2k";
    if (dir === "k2r") {
      const answer = e.romaji;
      return {
        id: `${e.script}:${e.kana}`,
        entry: e,
        dir,
        prompt: e.kana,
        speak: e.kana,
        answer,
        options: shuffle([
          answer,
          ...distractors(entries.map((x) => x.romaji), answer),
        ]),
      };
    }
    const answer = e.kana;
    return {
      id: `${e.script}:${e.kana}`,
      entry: e,
      dir,
      prompt: e.romaji,
      answer,
      options: shuffle([
        answer,
        ...distractors(entries.map((x) => x.kana), answer),
      ]),
    };
  });
}

export function KanaQuiz({ script }: { script: KanaScript }) {
  const { recordCard } = useProgress();
  const [questions, setQuestions] = useState<KQuestion[]>(() =>
    build(kanaOf(script)),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const q = questions[index];
  const answered = selected !== null;

  const choose = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    recordCard(q.id, opt === q.answer);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="flex flex-col items-center border border-line bg-paper px-6 py-14 text-center">
        {pct >= 70 ? <Hanko size={72} animate /> : null}
        <h3 className="mt-6 font-display text-3xl font-semibold text-sumi">
          {score} / {total}
        </h3>
        <p className="mt-1 text-sm text-sumi-soft">
          {pct >= 70
            ? "Nice — that is a firm grasp of the row."
            : "Keep going; try the chart again, then retry."}
        </p>
        <button
          type="button"
          onClick={() => {
            setQuestions(build(kanaOf(script)));
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
          {q.dir === "k2r" ? "Choose the romaji" : "Choose the kana"}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span
            className={`text-sumi ${
              q.dir === "k2r"
                ? "font-display text-5xl leading-none"
                : "font-mono text-4xl font-medium"
            }`}
          >
            {q.prompt}
          </span>
          {q.speak ? <SpeakButton text={q.speak} /> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {q.options.map((opt) => {
          const isAnswer = opt === q.answer;
          const isChosen = opt === selected;
          let border = "var(--color-line)";
          let bg = "transparent";
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
              className="flex items-center justify-between gap-3 border px-4 py-3.5 text-left transition-all disabled:cursor-default"
              style={{ borderColor: border, background: bg }}
            >
              <span
                className={`text-sumi ${
                  q.dir === "k2r"
                    ? "font-mono text-lg"
                    : "font-display text-2xl"
                }`}
              >
                {opt}
              </span>
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
          {index + 1 >= total ? "See result" : "Next"}
        </button>
      </div>
    </div>
  );
}
