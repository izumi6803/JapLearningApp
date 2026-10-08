import type { Metadata } from "next";
import { Roadmap } from "@/components/Roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Your path from kana through the Minna no Nihongo units, N5 to N1.",
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          計画 · Roadmap
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          Your path, 初級 → 上級
        </h1>
        <p className="mt-2 max-w-xl text-sm text-sumi-soft">
          Start with the kana, then work through each unit in order. Your
          position is marked as you complete lessons.
        </p>
      </header>

      <Roadmap />
    </div>
  );
}
