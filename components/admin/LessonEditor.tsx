"use client";

import Link from "next/link";
import { useState } from "react";
import type { Grammar, Kanji, Lesson, Vocab } from "@/lib/types";

type Keyed<T> = T & { key: string };

interface Draft {
  title: string;
  titleEn: string;
  source: string;
  vocab: Keyed<Vocab>[];
  grammar: Keyed<Grammar>[];
  kanji: Keyed<Kanji>[];
}

let seq = 0;
const newKey = () => `new-${Date.now()}-${seq++}`;

function toDraft(lesson: Lesson): Draft {
  return {
    title: lesson.title,
    titleEn: lesson.titleEn,
    source: lesson.source,
    vocab: lesson.vocab.map((v) => ({ ...v, key: v.id })),
    grammar: lesson.grammar.map((g) => ({ ...g, key: g.id })),
    kanji: lesson.kanji.map((k) => ({ ...k, key: k.id })),
  };
}

const inputClass =
  "w-full border border-line bg-washi px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-ai";

function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-sumi-soft">
          {label}
        </span>
      ) : null}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 self-start border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sumi-soft transition-colors hover:border-shu hover:text-shu"
    >
      remove
    </button>
  );
}

export function LessonEditor({ lesson }: { lesson: Lesson }) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(lesson));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const setVocab = (i: number, patch: Partial<Vocab>) =>
    setDraft((d) => ({
      ...d,
      vocab: d.vocab.map((v, idx) => (idx === i ? { ...v, ...patch } : v)),
    }));
  const setGrammar = (i: number, patch: Partial<Grammar>) =>
    setDraft((d) => ({
      ...d,
      grammar: d.grammar.map((g, idx) => (idx === i ? { ...g, ...patch } : g)),
    }));
  const setKanji = (i: number, patch: Partial<Kanji>) =>
    setDraft((d) => ({
      ...d,
      kanji: d.kanji.map((k, idx) => (idx === i ? { ...k, ...patch } : k)),
    }));

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "failed");
      setMessage({ ok: true, text: "Saved. Students will see this now." });
    } catch {
      setMessage({ ok: false, text: "Could not save. Check the fields and retry." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10 pb-24">
      {/* header fields */}
      <section className="grid gap-3 border border-line bg-paper p-5 sm:grid-cols-2">
        <Field
          label="Title (Japanese)"
          value={draft.title}
          onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
        />
        <Field
          label="Title (English)"
          value={draft.titleEn}
          onChange={(v) => setDraft((d) => ({ ...d, titleEn: v }))}
        />
        <Field
          label="Source"
          value={draft.source}
          onChange={(v) => setDraft((d) => ({ ...d, source: v }))}
          className="sm:col-span-2"
        />
      </section>

      {/* vocabulary */}
      <section>
        <div className="mb-3 flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-display text-xl font-semibold text-sumi">
            単語 Vocabulary{" "}
            <span className="font-mono text-xs text-sumi-soft">
              {draft.vocab.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                vocab: [
                  ...d.vocab,
                  {
                    id: newKey(),
                    key: newKey(),
                    term: "",
                    reading: "",
                    romaji: "",
                    meaning: "",
                  },
                ],
              }))
            }
            className="border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-ai hover:text-ai"
          >
            + Add word
          </button>
        </div>

        <ul className="space-y-2.5">
          {draft.vocab.map((v, i) => (
            <li
              key={v.key}
              className="grid grid-cols-[1fr_auto] gap-2 border border-line bg-paper p-3"
            >
              <div className="grid gap-2 sm:grid-cols-5">
                <Field label="term" value={v.term} onChange={(x) => setVocab(i, { term: x })} />
                <Field label="reading" value={v.reading} onChange={(x) => setVocab(i, { reading: x })} />
                <Field label="romaji" value={v.romaji} onChange={(x) => setVocab(i, { romaji: x })} />
                <Field label="meaning" value={v.meaning} onChange={(x) => setVocab(i, { meaning: x })} />
                <Field label="pos" value={v.pos ?? ""} onChange={(x) => setVocab(i, { pos: x })} />
                <Field
                  label="example (jp)"
                  value={v.example?.jp ?? ""}
                  onChange={(x) =>
                    setVocab(i, {
                      example: { jp: x, reading: v.example?.reading, en: v.example?.en ?? "" },
                    })
                  }
                  className="sm:col-span-3"
                />
                <Field
                  label="example (reading)"
                  value={v.example?.reading ?? ""}
                  onChange={(x) =>
                    setVocab(i, {
                      example: { jp: v.example?.jp ?? "", reading: x, en: v.example?.en ?? "" },
                    })
                  }
                />
                <Field
                  label="example (en)"
                  value={v.example?.en ?? ""}
                  onChange={(x) =>
                    setVocab(i, {
                      example: { jp: v.example?.jp ?? "", reading: v.example?.reading, en: x },
                    })
                  }
                />
              </div>
              <RemoveButton
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    vocab: d.vocab.filter((_, idx) => idx !== i),
                  }))
                }
              />
            </li>
          ))}
        </ul>
      </section>

      {/* grammar */}
      <section>
        <div className="mb-3 flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-display text-xl font-semibold text-sumi">
            文法 Grammar{" "}
            <span className="font-mono text-xs text-sumi-soft">
              {draft.grammar.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                grammar: [
                  ...d.grammar,
                  { id: newKey(), key: newKey(), point: "", meaning: "", explanation: "", examples: [] },
                ],
              }))
            }
            className="border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-ai hover:text-ai"
          >
            + Add pattern
          </button>
        </div>

        <ul className="space-y-3">
          {draft.grammar.map((g, i) => (
            <li key={g.key} className="grid grid-cols-[1fr_auto] gap-2 border border-line bg-paper p-3">
              <div className="grid gap-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="point" value={g.point} onChange={(x) => setGrammar(i, { point: x })} />
                  <Field label="meaning" value={g.meaning} onChange={(x) => setGrammar(i, { meaning: x })} />
                </div>
                <label className="block">
                  <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-sumi-soft">
                    explanation
                  </span>
                  <textarea
                    value={g.explanation}
                    onChange={(e) => setGrammar(i, { explanation: e.target.value })}
                    rows={2}
                    className="w-full resize-none border border-line bg-washi px-2.5 py-1.5 text-sm outline-none focus:border-ai"
                  />
                </label>

                <div className="border-l-2 border-ai/30 pl-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ai">
                      examples
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setGrammar(i, {
                          examples: [...g.examples, { jp: "", reading: "", en: "" }],
                        })
                      }
                      className="font-mono text-[10px] uppercase tracking-[0.14em] text-sumi-soft hover:text-ai"
                    >
                      + example
                    </button>
                  </div>
                  <div className="space-y-2">
                    {g.examples.map((ex, j) => (
                      <div key={j} className="grid grid-cols-[1fr_auto] gap-2">
                        <div className="grid gap-2 sm:grid-cols-3">
                          <Field
                            label="jp"
                            value={ex.jp}
                            onChange={(x) =>
                              setGrammar(i, {
                                examples: g.examples.map((e2, j2) =>
                                  j2 === j ? { ...e2, jp: x } : e2,
                                ),
                              })
                            }
                          />
                          <Field
                            label="reading"
                            value={ex.reading ?? ""}
                            onChange={(x) =>
                              setGrammar(i, {
                                examples: g.examples.map((e2, j2) =>
                                  j2 === j ? { ...e2, reading: x } : e2,
                                ),
                              })
                            }
                          />
                          <Field
                            label="en"
                            value={ex.en}
                            onChange={(x) =>
                              setGrammar(i, {
                                examples: g.examples.map((e2, j2) =>
                                  j2 === j ? { ...e2, en: x } : e2,
                                ),
                              })
                            }
                          />
                        </div>
                        <RemoveButton
                          onClick={() =>
                            setGrammar(i, {
                              examples: g.examples.filter((_, j2) => j2 !== j),
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <RemoveButton
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    grammar: d.grammar.filter((_, idx) => idx !== i),
                  }))
                }
              />
            </li>
          ))}
        </ul>
      </section>

      {/* kanji */}
      <section>
        <div className="mb-3 flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-display text-xl font-semibold text-sumi">
            漢字 Kanji{" "}
            <span className="font-mono text-xs text-sumi-soft">
              {draft.kanji.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                kanji: [
                  ...d.kanji,
                  { id: newKey(), key: newKey(), char: "", on: [], kun: [], meaning: "", strokes: 0, words: [] },
                ],
              }))
            }
            className="border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-ai hover:text-ai"
          >
            + Add kanji
          </button>
        </div>

        <ul className="space-y-3">
          {draft.kanji.map((k, i) => (
            <li key={k.key} className="grid grid-cols-[1fr_auto] gap-2 border border-line bg-paper p-3">
              <div className="grid gap-2">
                <div className="grid gap-2 sm:grid-cols-5">
                  <Field label="char" value={k.char} onChange={(x) => setKanji(i, { char: x })} />
                  <Field label="meaning" value={k.meaning} onChange={(x) => setKanji(i, { meaning: x })} className="sm:col-span-2" />
                  <Field
                    label="strokes"
                    value={String(k.strokes)}
                    onChange={(x) => setKanji(i, { strokes: Number(x) || 0 })}
                  />
                  <Field
                    label="on (comma)"
                    value={k.on.join(", ")}
                    onChange={(x) =>
                      setKanji(i, {
                        on: x.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </div>
                <Field
                  label="kun (comma)"
                  value={k.kun.join(", ")}
                  onChange={(x) =>
                    setKanji(i, {
                      kun: x.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />

                <div className="border-l-2 border-ai/30 pl-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ai">
                      words
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setKanji(i, {
                          words: [...k.words, { term: "", reading: "", meaning: "" }],
                        })
                      }
                      className="font-mono text-[10px] uppercase tracking-[0.14em] text-sumi-soft hover:text-ai"
                    >
                      + word
                    </button>
                  </div>
                  <div className="space-y-2">
                    {k.words.map((w, j) => (
                      <div key={j} className="grid grid-cols-[1fr_auto] gap-2">
                        <div className="grid gap-2 sm:grid-cols-3">
                          <Field
                            label="term"
                            value={w.term}
                            onChange={(x) =>
                              setKanji(i, {
                                words: k.words.map((w2, j2) => (j2 === j ? { ...w2, term: x } : w2)),
                              })
                            }
                          />
                          <Field
                            label="reading"
                            value={w.reading}
                            onChange={(x) =>
                              setKanji(i, {
                                words: k.words.map((w2, j2) => (j2 === j ? { ...w2, reading: x } : w2)),
                              })
                            }
                          />
                          <Field
                            label="meaning"
                            value={w.meaning}
                            onChange={(x) =>
                              setKanji(i, {
                                words: k.words.map((w2, j2) => (j2 === j ? { ...w2, meaning: x } : w2)),
                              })
                            }
                          />
                        </div>
                        <RemoveButton
                          onClick={() =>
                            setKanji(i, { words: k.words.filter((_, j2) => j2 !== j) })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <RemoveButton
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    kanji: d.kanji.filter((_, idx) => idx !== i),
                  }))
                }
              />
            </li>
          ))}
        </ul>
      </section>

      {/* save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {message ? (
              <span
                className="font-mono text-xs"
                style={{
                  color: message.ok ? "var(--color-matcha)" : "var(--color-shu)",
                }}
              >
                {message.text}
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sumi-soft">
                {lesson.level} · Lesson {lesson.number}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/lessons/${lesson.id}`}
              className="border border-line px-4 py-2 text-sm font-medium text-sumi transition-colors hover:border-sumi"
            >
              View lesson
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="bg-sumi px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ai disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
