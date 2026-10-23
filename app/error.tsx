"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <span
        aria-hidden="true"
        className="hanko"
        style={{ width: 72, height: 72, fontSize: 25 }}
      >
        誤
      </span>
      <h1 className="mt-7 font-display text-4xl font-semibold text-sumi">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-sumi-soft">
        A temporary error occurred. Try again, or head back to the dashboard.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-line px-5 py-2.5 text-sm font-medium text-sumi transition-colors hover:border-sumi"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
