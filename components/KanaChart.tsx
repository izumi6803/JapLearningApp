"use client";

import { Fragment, useState } from "react";
import { kanaGroups, type KanaScript } from "@/data/kana";
import { speakJa } from "@/lib/speech";

export function KanaChart({ script }: { script: KanaScript }) {
  const [showRomaji, setShowRomaji] = useState(true);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
          Tap any character to hear it
        </p>
        <button
          type="button"
          onClick={() => setShowRomaji((s) => !s)}
          aria-pressed={!showRomaji}
          className="border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-ai hover:text-ai"
        >
          {showRomaji ? "Hide romaji · 隠す" : "Show romaji · 表示"}
        </button>
      </div>

      <div className="space-y-10">
        {kanaGroups.map((group) => (
          <section key={group.id}>
            <header className="mb-3 flex items-baseline gap-3 border-b border-line pb-2">
              <h3 className="font-display text-lg font-semibold text-sumi">
                {group.label}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sumi-soft">
                {group.note}
              </span>
            </header>

            <div
              className="grid gap-px overflow-hidden border border-line bg-line"
              style={{
                gridTemplateColumns: `5.5rem repeat(${group.columns}, minmax(0, 1fr))`,
              }}
            >
              {group.rows.map((row) => (
                <Fragment key={row.id}>
                  <div className="flex flex-col justify-center bg-washi px-2 py-3">
                    <span className="font-display text-sm text-sumi">
                      {row.label}
                    </span>
                    <span className="font-mono text-[10px] text-sumi-soft">
                      {row.romaji}
                    </span>
                  </div>

                  {row.cells.map((c, i) =>
                    c ? (
                      <button
                        key={`${row.id}-${i}`}
                        type="button"
                        title={`${script === "hiragana" ? c.h : c.k} · ${c.r}`}
                        onClick={() => speakJa(script === "hiragana" ? c.h : c.k)}
                        className="group flex min-h-[4.25rem] flex-col items-center justify-center bg-paper px-1 py-3 transition-colors hover:bg-washi active:bg-paper-deep"
                      >
                        <span className="font-display text-3xl leading-none text-sumi transition-colors group-hover:text-ai">
                          {script === "hiragana" ? c.h : c.k}
                        </span>
                        <span
                          className="mt-1.5 font-mono text-[10px] tracking-wide text-sumi-soft"
                          style={{ opacity: showRomaji ? 1 : 0 }}
                          aria-hidden={!showRomaji}
                        >
                          {c.r}
                        </span>
                      </button>
                    ) : (
                      <span
                        key={`${row.id}-${i}`}
                        aria-hidden="true"
                        className="min-h-[4.25rem] bg-paper-deep/40"
                      />
                    ),
                  )}
                </Fragment>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
