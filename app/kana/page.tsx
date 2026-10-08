import type { Metadata } from "next";
import { KanaWorkspace } from "@/components/KanaWorkspace";
import type { KanaScript } from "@/data/kana";
import { redirectAdminToConsole } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "Hiragana & Katakana",
  description:
    "Learn the full hiragana and katakana syllabary — seion, dakuon, handakuon and yōon — with audio, flashcards and quizzes.",
};

export default async function KanaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await redirectAdminToConsole();
  const sp = await searchParams;
  const raw = Array.isArray(sp.script) ? sp.script[0] : sp.script;
  const initialScript: KanaScript =
    raw === "katakana" ? "katakana" : "hiragana";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          かな · Kana
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          五十音
        </h1>
        <p className="mt-2 max-w-xl text-sm text-sumi-soft">
          Both syllabaries, basic through contracted sounds. Tap a character to
          hear it, then test yourself with flashcards and a quick quiz.
        </p>
      </header>

      <KanaWorkspace initialScript={initialScript} />
    </div>
  );
}
