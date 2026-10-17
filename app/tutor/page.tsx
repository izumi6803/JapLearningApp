import type { Metadata } from "next";
import { TutorWorkspace } from "@/components/TutorWorkspace";
import { getLessons } from "@/lib/lessons/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tutor",
  description:
    "Ask an AI Japanese tutor anything, or roleplay real conversations by voice with corrections.",
};

export default async function TutorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.mode) ? sp.mode[0] : sp.mode;
  const initialMode = raw === "conversation" ? "conversation" : "tutor";
  const lessons = await getLessons();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          先生 · AI
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          Your AI tutor
        </h1>
        <p className="mt-2 max-w-xl text-sm text-sumi-soft">
          Ask questions about grammar and vocabulary, or practise a real
          conversation out loud. Powered by Groq.
        </p>
      </header>

      <TutorWorkspace lessons={lessons} initialMode={initialMode} />
    </div>
  );
}
