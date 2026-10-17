export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="h-3 w-32 animate-pulse bg-line" />
      <div className="mt-3 h-9 w-56 animate-pulse bg-line" />
      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-28 animate-pulse border border-line" />
        ))}
      </div>
      <div className="mt-10 space-y-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse border border-line bg-paper"
          />
        ))}
      </div>
    </div>
  );
}
