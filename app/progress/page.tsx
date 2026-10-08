import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { getLessons } from "@/lib/lessons/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Progress",
  description: "Your Minna no Nihongo study progress across N5–N1.",
};

export default async function ProgressPage() {
  const lessons = await getLessons();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          進捗 · Progress
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          学習の記録
        </h1>
        <p className="mt-2 max-w-lg text-sm text-sumi-soft">
          Everything below lives in this browser only — no account, no server.
        </p>
      </header>

      <ProgressDashboard lessons={lessons} />
    </div>
  );
}
