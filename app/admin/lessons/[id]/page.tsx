import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LessonEditor } from "@/components/admin/LessonEditor";
import { requireAdmin } from "@/lib/auth/guard";
import { getLesson } from "@/lib/lessons/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit lesson",
  description: "Edit lesson content.",
};

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = await requireAdmin();
  if (!admin) redirect(`/signin?next=/admin/lessons/${id}`);

  const lesson = await getLesson(id);
  if (!lesson) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          編集 · Edit
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-sumi">
          {lesson.level} · Lesson {lesson.number} · {lesson.title}
        </h1>
      </header>

      <LessonEditor lesson={lesson} />
    </div>
  );
}
