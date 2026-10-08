export type Level = "N5" | "N4" | "N3" | "N2" | "N1";

export interface Example {
  jp: string;
  reading?: string;
  en: string;
}

export interface Vocab {
  id: string;
  term: string;
  reading: string;
  romaji: string;
  meaning: string;
  pos?: string;
  example?: Example;
}

export interface Grammar {
  id: string;
  point: string;
  meaning: string;
  explanation: string;
  examples: Example[];
}

export interface KanjiWord {
  term: string;
  reading: string;
  meaning: string;
}

export interface Kanji {
  id: string;
  char: string;
  on: string[];
  kun: string[];
  meaning: string;
  strokes: number;
  words: KanjiWord[];
}

export interface Lesson {
  id: string;
  level: Level;
  number: number;
  title: string;
  titleEn: string;
  source: string;
  vocab: Vocab[];
  grammar: Grammar[];
  kanji: Kanji[];
}

export interface LevelMeta {
  level: Level;
  name: string;
  kana: string;
  color: string;
  blurb: string;
  books: string;
}

export type VocabSeed = Omit<Vocab, "id">;
export type GrammarSeed = Omit<Grammar, "id">;
export type KanjiSeed = Omit<Kanji, "id">;

export interface LessonSeed {
  id: string;
  level: Level;
  number: number;
  title: string;
  titleEn: string;
  source: string;
  vocab: VocabSeed[];
  grammar: GrammarSeed[];
  kanji: KanjiSeed[];
}

export function hydrateLesson(seed: LessonSeed): Lesson {
  return {
    ...seed,
    vocab: seed.vocab.map((v, i) => ({ ...v, id: `${seed.id}.v${i + 1}` })),
    grammar: seed.grammar.map((g, i) => ({ ...g, id: `${seed.id}.g${i + 1}` })),
    kanji: seed.kanji.map((k, i) => ({ ...k, id: `${seed.id}.k${i + 1}` })),
  };
}

export const LEVELS: LevelMeta[] = [
  {
    level: "N5",
    name: "Beginner",
    kana: "初級 I",
    color: "#6e8b3d",
    blurb: "Introduce yourself, count, shop, and talk about daily life.",
    books: "Minna no Nihongo I · Lessons 1–25",
  },
  {
    level: "N4",
    name: "Elementary",
    kana: "初級 II",
    color: "#2f7ca6",
    blurb: "Plans, experience, conditionals, and giving & receiving.",
    books: "Minna no Nihongo II · Lessons 26–50",
  },
  {
    level: "N3",
    name: "Intermediate",
    kana: "中級",
    color: "#6e63a6",
    blurb: "Nuance, reported speech, and longer natural texts.",
    books: "Minna no Nihongo Intermediate",
  },
  {
    level: "N2",
    name: "Upper Intermediate",
    kana: "上級 I",
    color: "#b2453f",
    blurb: "Formal register, news, and abstract argument.",
    books: "Minna no Nihongo Intermediate II",
  },
  {
    level: "N1",
    name: "Advanced",
    kana: "上級 II",
    color: "#2b2d34",
    blurb: "Literary, business, and near-native comprehension.",
    books: "Advanced readers",
  },
];

export const LEVEL_ORDER: Level[] = ["N5", "N4", "N3", "N2", "N1"];

export function sortLessons(list: Lesson[]): Lesson[] {
  return [...list].sort(
    (a, b) =>
      LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) ||
      a.number - b.number,
  );
}

export function lessonsOf(list: Lesson[], level: Level): Lesson[] {
  return list.filter((l) => l.level === level);
}

export function countsByLevel(list: Lesson[]): Record<Level, number> {
  return LEVEL_ORDER.reduce(
    (acc, level) => {
      acc[level] = list.filter((l) => l.level === level).length;
      return acc;
    },
    {} as Record<Level, number>,
  );
}

export function neighboursOf(
  list: Lesson[],
  id: string,
): { prev?: Lesson; next?: Lesson } {
  const sorted = sortLessons(list);
  const i = sorted.findIndex((l) => l.id === id);
  if (i === -1) return {};
  return { prev: sorted[i - 1], next: sorted[i + 1] };
}

export function levelMeta(level: Level): LevelMeta {
  return LEVELS.find((l) => l.level === level)!;
}

export function levelColor(level: Level): string {
  return levelMeta(level).color;
}
