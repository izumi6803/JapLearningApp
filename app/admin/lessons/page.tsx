import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getLessons } from "@/lib/lessons/repository";
import { LEVEL_ORDER, lessonsOf, levelColor } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage lessons",
  description: "Edit Minna no Nihongo lesson content.",
};

export default async function AdminLessonsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/signin?next=/admin/lessons");

  const lessons = await getLessons();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
        <Link href="/admin" className="transition-colors hover:text-sumi">
          ← Admin
        </Link>
      </nav>

      <header className="mb-8 mt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          教材 · Content
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          Manage lessons
        </h1>
        <p className="mt-2 max-w-xl text-sm text-sumi-soft">
          Edits save to the database and are visible to students immediately.
        </p>
      </header>

      <div className="space-y-10">
        {LEVEL_ORDER.map((level) => {
          const group = lessonsOf(lessons, level);
          if (!group.length) return null;
          return (
            <section key={level}>
              <div className="mb-3 flex items-baseline gap-3 border-b border-line pb-2">
                <span
                  className="font-display text-2xl font-semibold leading-none"
                  style={{ color: levelColor(level) }}
                >
                  {level}
                </span>
                <span className="font-mono text-[11px] text-sumi-soft">
                  {group.length} 課
                </span>
              </div>
              <ul className="divide-y divide-line">
                {group.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/admin/lessons/${lesson.id}`}
                      className="group grid grid-cols-[1fr_auto] items-center gap-4 py-3 transition-colors hover:bg-washi"
                    >
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-2.5">
                          <span className="font-mono text-xs text-sumi-soft">
                            {String(lesson.number).padStart(2, "0")}
                          </span>
                          <span className="font-display text-base font-semibold text-sumi">
                            {lesson.title}
                          </span>
                        </span>
                        <span className="mt-0.5 block font-mono text-[11px] text-sumi-soft">
                          {lesson.vocab.length} 語 · {lesson.grammar.length} 文型 ·{" "}
                          {lesson.kanji.length} 漢字
                        </span>
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ai opacity-0 transition-opacity group-hover:opacity-100">
                        Edit →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
