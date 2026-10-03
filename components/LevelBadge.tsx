import { levelColor, type Level } from "@/lib/types";

export function LevelBadge({
  level,
  size = "md",
}: {
  level: Level;
  size?: "sm" | "md";
}) {
  const color = levelColor(level);
  const dims = size === "sm" ? "h-6 px-2 text-[11px]" : "h-7 px-2.5 text-xs";
  return (
    <span
      className={`inline-flex items-center rounded-none font-mono font-medium tracking-[0.15em] ${dims}`}
      style={{
        color,
        border: `1.5px solid ${color}`,
        backgroundColor: `${color}14`,
      }}
    >
      {level}
    </span>
  );
}
