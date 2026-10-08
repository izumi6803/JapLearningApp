import type {
  Example,
  GrammarSeed,
  KanjiSeed,
  KanjiWord,
  LessonSeed,
  VocabSeed,
} from "@/lib/types";

function str(value: unknown, max = 400): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function num(value: unknown, max = 999): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.round(n))) : 0;
}

function strings(value: unknown, max = 20, len = 40): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => str(v, len))
    .filter(Boolean)
    .slice(0, max);
}

function example(value: unknown): Example | null {
  if (!value || typeof value !== "object") return null;
  const e = value as Record<string, unknown>;
  const jp = str(e.jp, 500);
  const en = str(e.en, 500);
  if (!jp && !en) return null;
  const reading = str(e.reading, 500);
  return reading ? { jp, en, reading } : { jp, en };
}

function examples(value: unknown): Example[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(example)
    .filter((e): e is Example => Boolean(e))
    .slice(0, 20);
}

function vocab(value: unknown): VocabSeed[] {
  if (!Array.isArray(value)) return [];
  const out: VocabSeed[] = [];
  for (const raw of value.slice(0, 400)) {
    if (!raw || typeof raw !== "object") continue;
    const v = raw as Record<string, unknown>;
    const term = str(v.term, 120);
    const meaning = str(v.meaning, 240);
    if (!term && !meaning) continue;
    const item: VocabSeed = {
      term,
      reading: str(v.reading, 120),
      romaji: str(v.romaji, 120),
      meaning,
    };
    const pos = str(v.pos, 40);
    if (pos) item.pos = pos;
    const ex = example(v.example);
    if (ex) item.example = ex;
    out.push(item);
  }
  return out;
}

function grammar(value: unknown): GrammarSeed[] {
  if (!Array.isArray(value)) return [];
  const out: GrammarSeed[] = [];
  for (const raw of value.slice(0, 60)) {
    if (!raw || typeof raw !== "object") continue;
    const g = raw as Record<string, unknown>;
    const point = str(g.point, 240);
    if (!point) continue;
    out.push({
      point,
      meaning: str(g.meaning, 240),
      explanation: str(g.explanation, 1200),
      examples: examples(g.examples),
    });
  }
  return out;
}

function kanjiWords(value: unknown): KanjiWord[] {
  if (!Array.isArray(value)) return [];
  const out: KanjiWord[] = [];
  for (const raw of value.slice(0, 30)) {
    if (!raw || typeof raw !== "object") continue;
    const w = raw as Record<string, unknown>;
    const term = str(w.term, 80);
    if (!term) continue;
    out.push({
      term,
      reading: str(w.reading, 80),
      meaning: str(w.meaning, 160),
    });
  }
  return out;
}

function kanji(value: unknown): KanjiSeed[] {
  if (!Array.isArray(value)) return [];
  const out: KanjiSeed[] = [];
  for (const raw of value.slice(0, 120)) {
    if (!raw || typeof raw !== "object") continue;
    const k = raw as Record<string, unknown>;
    const char = str(k.char, 8);
    if (!char) continue;
    out.push({
      char,
      on: strings(k.on),
      kun: strings(k.kun),
      meaning: str(k.meaning, 160),
      strokes: num(k.strokes),
      words: kanjiWords(k.words),
    });
  }
  return out;
}

/** Builds a clean lesson seed from untrusted editor input, keeping identity fields. */
export function sanitizeLessonSeed(
  input: unknown,
  base: Pick<LessonSeed, "id" | "level" | "number">,
): LessonSeed {
  const raw = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  return {
    id: base.id,
    level: base.level,
    number: base.number,
    title: str(raw.title, 200) || base.id,
    titleEn: str(raw.titleEn, 200),
    source: str(raw.source, 200),
    vocab: vocab(raw.vocab),
    grammar: grammar(raw.grammar),
    kanji: kanji(raw.kanji),
  };
}
