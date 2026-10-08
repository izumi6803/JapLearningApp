import Link from "next/link";

const ACTIONS = [
  { href: "/kana", kana: "かな", label: "Kana" },
  { href: "/lessons", kana: "課", label: "Lessons" },
  { href: "/review", kana: "復習", label: "Review" },
  { href: "/study", kana: "練習", label: "Study" },
  { href: "/tutor", kana: "先生", label: "Tutor" },
  { href: "/roadmap", kana: "計画", label: "Roadmap" },
] as const;

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden border border-line bg-line sm:grid-cols-6">
      {ACTIONS.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="group flex flex-col items-center gap-2 bg-paper px-3 py-5 transition-colors hover:bg-washi"
        >
          <span className="font-display text-2xl leading-none text-sumi transition-colors group-hover:text-ai">
            {a.kana}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sumi-soft">
            {a.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
