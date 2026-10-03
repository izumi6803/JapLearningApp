import type { Grammar } from "@/lib/types";
import { SpeakButton } from "./SpeakButton";

export function GrammarList({ items }: { items: Grammar[] }) {
  return (
    <ol className="space-y-4">
      {items.map((g, i) => (
        <li key={g.id} className="border border-line bg-paper">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-3">
            <h3 className="flex items-baseline gap-3 font-display text-xl text-sumi">
              <span className="font-mono text-xs text-sumi-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              {g.point}
            </h3>
            <p className="font-display text-sm text-shu">{g.meaning}</p>
          </div>

          <div className="px-5 py-4">
            <p className="max-w-2xl text-sm leading-relaxed text-sumi-soft">
              {g.explanation}
            </p>

            <ul className="mt-4 space-y-3">
              {g.examples.map((ex, j) => (
                <li key={j} className="border-l-2 border-ai/30 pl-3">
                  <div className="flex items-start gap-2">
                    <p className="font-display text-[15px] leading-relaxed text-sumi">
                      {ex.jp}
                    </p>
                    <SpeakButton text={ex.jp} />
                  </div>
                  {ex.reading ? (
                    <p className="mt-0.5 font-mono text-[11px] text-ai">
                      {ex.reading}
                    </p>
                  ) : null}
                  <p className="mt-0.5 text-sm text-sumi-soft">{ex.en}</p>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
