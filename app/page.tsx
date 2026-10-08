import Link from "next/link";
import { AdvisorCard } from "@/components/AdvisorCard";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TodayPlan } from "@/components/dashboard/TodayPlan";
import { LessonCard } from "@/components/LessonCard";
import { LevelLadder } from "@/components/LevelLadder";
import { TodayStrip } from "@/components/TodayStrip";
import { getLessons } from "@/lib/lessons/repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lessons = await getLessons();
  const startLessons = lessons.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <DashboardGreeting />

      <div className="mt-6">
        <TodayStrip lessons={lessons} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="space-y-12">
          <TodayPlan lessons={lessons} />

          <section>
            <h2 className="mb-4 font-display text-2xl font-semibold text-sumi">
              Jump to
            </h2>
            <QuickActions />
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-sumi">
                The five levels
              </h2>
              <Link
                href="/roadmap"
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-ai transition-colors hover:text-shu"
              >
                Full roadmap →
              </Link>
            </div>
            <LevelLadder lessons={lessons} />
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-sumi">
                Start a unit
              </h2>
              <Link
                href="/lessons"
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-ai transition-colors hover:text-shu"
              >
                All lessons →
              </Link>
            </div>
            <div className="grid gap-2.5">
              {startLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <AdvisorCard />
          <div className="border border-line bg-paper p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sumi-soft">
              Tip
            </p>
            <p className="mt-2 font-display text-sm leading-relaxed text-sumi-soft">
              日本語は一日十分。 Ten focused minutes every day beats one long
              cram a week — your streak and review queue do the rest.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
