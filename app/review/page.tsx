import type { Metadata } from "next";
import { ReviewSession } from "@/components/ReviewSession";

export const metadata: Metadata = {
  title: "Review",
  description:
    "Clear the vocabulary and kanji from older lessons that are due for spaced review.",
};

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-shu">
          復習 · Review
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          Don&apos;t forget the old ones
        </h1>
        <p className="mt-2 max-w-xl text-sm text-sumi-soft">
          Earlier lessons come back as their review intervals elapse, and the
          cards you keep missing stay in rotation.
        </p>
      </header>

      <ReviewSession />
    </div>
  );
}
