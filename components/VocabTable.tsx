"use client";

import { useState } from "react";
import type { Vocab } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

export function VocabTable({ items }: { items: Vocab[] }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((v) =>
        [v.term, v.reading, v.romaji, v.meaning].some((f) =>
          f.toLowerCase().includes(q),
        ),
      )
    : items;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
          {filtered.length} / {items.length} 単語
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search meaning, reading…"
          className="w-full max-w-xs border border-line bg-paper px-3 py-1.5 text-sm outline-none transition-colors placeholder:text-sumi-soft/60 focus:border-ai"
          aria-label="Search vocabulary"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-sumi-soft">
          No words match “{query}”.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {filtered.map((v) => (
            <li
              key={v.id}
              className="grid gap-x-6 gap-y-2 py-4 sm:grid-cols-[minmax(0,11rem)_1fr]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl leading-none text-sumi">
                    {v.term}
                  </span>
                  <SpeakButton text={v.term} />
                </div>
                <p className="mt-1 font-mono text-xs tracking-wide text-ai">
                  {v.reading}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[15px] text-sumi">{v.meaning}</p>
                <p className="mt-0.5 font-mono text-[11px] text-sumi-soft">
                  {v.romaji}
                  {v.pos ? ` · ${v.pos}` : ""}
                </p>
                {v.example ? (
                  <div className="mt-2.5 border-l-2 border-line pl-3">
                    <div className="flex items-start gap-2">
                      <p className="font-display text-sm leading-relaxed text-sumi">
                        {v.example.jp}
                      </p>
                      <SpeakButton text={v.example.jp} tone="shu" />
                    </div>
                    {v.example.reading ? (
                      <p className="font-mono text-[11px] text-ai">
                        {v.example.reading}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-sumi-soft">
                      {v.example.en}
                    </p>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
