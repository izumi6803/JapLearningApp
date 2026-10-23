import Link from "next/link";
import { Hanko } from "@/components/Hanko";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <Hanko size={72} label="無" />
      <h1 className="mt-7 font-display text-4xl font-semibold text-sumi">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-sumi-soft">
        That page doesn’t exist, or it has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai"
        >
          Go home
        </Link>
        <Link
          href="/lessons"
          className="border border-line px-5 py-2.5 text-sm font-medium text-sumi transition-colors hover:border-sumi"
        >
          Browse lessons
        </Link>
      </div>
    </div>
  );
}
