import Link from "next/link";
import { AdvisorCard } from "@/components/AdvisorCard";
import { ContinueStudying } from "@/components/ContinueStudying";
import { Hanko } from "@/components/Hanko";
import { LevelLadder } from "@/components/LevelLadder";
import { TodayStrip } from "@/components/TodayStrip";
import { totals } from "@/data";

const HERO_KANA = ["は", "じ", "め", "ま", "し", "て"];

const MODES = [
  {
    key: "kana",
    mode: "kana",
    kana: "かな",
    title: "Hiragana & Katakana",
    desc: "The fifty sounds in both scripts, with audio, flashcards and quizzes.",
  },
  {
    key: "flashcards",
    mode: "flashcards",
    kana: "単語",
    title: "Vocabulary flashcards",
    desc: "Flip, recall, then grade yourself. Cards you miss come back first.",
  },
  {
    key: "kanji",
    mode: "kanji",
    kana: "漢字",
    title: "Kanji practice",
    desc: "Trace each character on composition paper and learn its readings.",
  },
  {
    key: "quiz",
    mode: "quiz",
    kana: "試験",
    title: "Lesson quizzes",
    desc: "Multiple-choice checks drawn from every unit you have studied.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ---- hero ---- */}
      <section className="paper-grid border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:py-20">
          <div className="animate-rise">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ai">
              Minna no Nihongo · N5 → N1
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-sumi sm:text-5xl lg:text-6xl">
              日本語を、
              <br />
              はじめよう。
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-sumi-soft">
              Vocabulary, grammar and kanji from the Minna no Nihongo
              series — with pronunciation, flashcards and tests. Nothing to
              sign up for; your progress is kept in this browser.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={{ pathname: "/lessons", query: { level: "N5" } }}
                className="group inline-flex items-center gap-2 bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai"
              >
                Start at N5
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="/lessons"
                className="inline-flex items-center gap-2 border border-sumi/25 px-5 py-2.5 text-sm font-medium text-sumi transition-colors hover:border-sumi"
              >
                Browse all {totals.lessons} units
              </Link>
              <Link
                href="/tutor"
                className="inline-flex items-center gap-2 border border-ai px-5 py-2.5 text-sm font-medium text-ai transition-colors hover:bg-ai hover:text-paper"
              >
                Ask the AI tutor
              </Link>
            </div>

            <p className="mt-4 text-sm text-sumi-soft">
              New to Japanese?{" "}
              <Link
                href="/kana"
                className="font-medium text-ai underline decoration-ai/30 underline-offset-4 transition-colors hover:decoration-ai"
              >
                Start with the 五十音 →
              </Link>
            </p>

            <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
              {[
                ["単語", totals.vocab, "words"],
                ["文型", totals.grammar, "patterns"],
                ["漢字", totals.kanji, "kanji"],
                ["課", totals.lessons, "units"],
              ].map(([kana, value, label]) => (
                <div key={label as string}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-sumi-soft">
                    {kana}
                  </dt>
                  <dd className="font-display text-3xl font-semibold leading-none text-sumi">
                    {value as number}
                  </dd>
                  <dd className="mt-1 text-[11px] text-sumi-soft">
                    {label as string}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* composition-paper strip, Lesson 1 */}
          <div className="animate-rise justify-self-center lg:justify-self-end">
            <div className="relative flex flex-col items-center">
              <div className="flex flex-col border border-line bg-paper p-2 shadow-[0_24px_60px_-40px_rgba(26,27,30,0.7)]">
                {HERO_KANA.map((k, i) => (
                  <span
                    key={k}
                    className="genko-cell w-14 border-b-0 font-display text-3xl text-sumi last:border-b"
                    style={{
                      animation: `rise 0.5s ease-out ${0.12 + i * 0.09}s both`,
                    }}
                  >
                    {k}
                  </span>
                ))}
              </div>
              <Hanko size={60} className="-mt-6 ml-16 self-end" />
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.26em] text-sumi-soft">
                Lesson 1 — はじめまして
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- continue + ladder ---- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <TodayStrip />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div>
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-sumi">
                The five levels
              </h2>
              <Link
                href="/roadmap"
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-ai transition-colors hover:text-shu"
              >
                Full roadmap →
              </Link>
            </div>
            <LevelLadder />
          </div>

          <div className="space-y-6">
            <AdvisorCard />
            <ContinueStudying />
          </div>
        </div>
      </section>

      {/* ---- study modes ---- */}
      <section className="border-t border-line bg-paper/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-sumi">
            Four ways to drill
          </h2>
          <p className="mt-2 max-w-xl text-sm text-sumi-soft">
            Start with the kana if Japanese is new to you, then move through the
            textbook units. Every unit feeds the same study tools.
          </p>

          <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {MODES.map((mode) => (
              <Link
                key={mode.key}
                href={
                  mode.mode === "kana"
                    ? "/kana"
                    : { pathname: "/study", query: { mode: mode.mode } }
                }
                className="group flex flex-col bg-paper p-6 transition-colors hover:bg-washi"
              >
                <span className="font-display text-4xl leading-none text-ai">
                  {mode.kana}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-sumi">
                  {mode.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-sumi-soft">
                  {mode.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft transition-colors group-hover:text-shu">
                  Open
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
