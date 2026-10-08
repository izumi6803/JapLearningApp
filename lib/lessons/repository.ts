import { cache } from "react";
import { lessonSeeds } from "@/data/seeds";
import {
  LESSONS_FILE,
  assertBackend,
  ensureSchema,
  pool,
  readJson,
  usePg,
  withFileLock,
  writeJson,
} from "@/lib/auth/repository";
import {
  hydrateLesson,
  sortLessons,
  type GrammarSeed,
  type KanjiSeed,
  type Lesson,
  type LessonSeed,
  type Level,
  type VocabSeed,
} from "@/lib/types";
import { sanitizeLessonSeed } from "./schema";

interface LessonRow {
  id: string;
  level: string;
  number: number;
  title: string;
  title_en: string;
  source: string;
  data:
    | { vocab?: VocabSeed[]; grammar?: GrammarSeed[]; kanji?: KanjiSeed[] }
    | null
    | string;
}

const LEVEL_SET = new Set(["N5", "N4", "N3", "N2", "N1"]);

function rowToSeed(row: LessonRow): LessonSeed {
  let data = row.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data) as LessonRow["data"];
    } catch {
      data = null;
    }
  }
  const payload = (data ?? {}) as {
    vocab?: VocabSeed[];
    grammar?: GrammarSeed[];
    kanji?: KanjiSeed[];
  };
  return {
    id: row.id,
    level: (LEVEL_SET.has(row.level) ? row.level : "N5") as Level,
    number: row.number,
    title: row.title,
    titleEn: row.title_en,
    source: row.source,
    vocab: payload.vocab ?? [],
    grammar: payload.grammar ?? [],
    kanji: payload.kanji ?? [],
  };
}

async function seedPg(): Promise<void> {
  for (const seed of lessonSeeds) {
    await pool().query(
      `INSERT INTO lessons (id, level, number, title, title_en, source, data)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (id) DO NOTHING`,
      [
        seed.id,
        seed.level,
        seed.number,
        seed.title,
        seed.titleEn,
        seed.source,
        JSON.stringify({
          vocab: seed.vocab,
          grammar: seed.grammar,
          kanji: seed.kanji,
        }),
      ],
    );
  }
}

async function loadLessons(): Promise<Lesson[]> {
  assertBackend();
  if (usePg) {
    await ensureSchema();
    let res = await pool().query<LessonRow>("SELECT * FROM lessons");
    if (res.rows.length === 0) {
      await seedPg();
      res = await pool().query<LessonRow>("SELECT * FROM lessons");
    }
    return sortLessons(res.rows.map(rowToSeed).map(hydrateLesson));
  }

  let stored = await readJson<LessonSeed[]>(LESSONS_FILE, []);
  if (stored.length === 0) {
    stored = lessonSeeds;
    await writeJson(LESSONS_FILE, stored);
  }
  return sortLessons(stored.map(hydrateLesson));
}

export const getLessons = cache(loadLessons);

export const getLesson = cache(
  async (id: string): Promise<Lesson | undefined> => {
    const all = await getLessons();
    return all.find((l) => l.id === id);
  },
);

export async function updateLesson(
  id: string,
  input: unknown,
): Promise<Lesson | null> {
  assertBackend();
  const current = await getLesson(id);
  if (!current) return null;

  const clean = sanitizeLessonSeed(input, {
    id: current.id,
    level: current.level,
    number: current.number,
  });
  const payload = {
    vocab: clean.vocab,
    grammar: clean.grammar,
    kanji: clean.kanji,
  };

  if (usePg) {
    await ensureSchema();
    await pool().query(
      `UPDATE lessons
         SET title = $2, title_en = $3, source = $4, data = $5, updated_at = now()
       WHERE id = $1`,
      [id, clean.title, clean.titleEn, clean.source, JSON.stringify(payload)],
    );
  } else {
    await withFileLock(async () => {
      const stored = await readJson<LessonSeed[]>(LESSONS_FILE, lessonSeeds);
      const next = stored.map((s) => (s.id === id ? clean : s));
      await writeJson(LESSONS_FILE, next);
    });
  }

  return hydrateLesson(clean);
}
