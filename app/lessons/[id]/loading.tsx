export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="h-3 w-40 animate-pulse bg-line" />
      <div className="mt-5 flex items-start gap-5">
        <div className="h-20 w-20 shrink-0 animate-pulse border border-line bg-paper" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-3 w-48 animate-pulse bg-line" />
          <div className="h-7 w-64 animate-pulse bg-line" />
          <div className="h-3 w-32 animate-pulse bg-line" />
        </div>
      </div>
      <div className="mt-8 h-14 animate-pulse border border-line bg-paper" />
      <div className="mt-6 h-72 animate-pulse border border-line bg-paper" />
    </div>
  );
}
