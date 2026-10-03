import { totals } from "@/data";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-sumi-soft sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-base text-sumi">みんなの日本語</p>
          <p className="mt-1 max-w-md text-xs leading-relaxed">
            A study companion for the Minna no Nihongo series. Vocabulary,
            grammar, kanji and tests across the N5–N1 bands. Progress stays in
            your browser.
          </p>
        </div>
        <p className="font-mono text-[11px] tracking-wider text-sumi-soft">
          {totals.lessons} units · {totals.vocab} words · {totals.kanji} kanji
        </p>
      </div>
    </footer>
  );
}
