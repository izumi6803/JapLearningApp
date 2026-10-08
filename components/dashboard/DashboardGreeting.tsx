"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export function DashboardGreeting() {
  const { user, loading } = useAuth();
  const name = user?.name ?? user?.email.split("@")[0] ?? "";

  return (
    <section className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
      <div className="min-w-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          学習デスク · Study desk
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-sumi sm:text-4xl">
          {loading
            ? "Your Japanese study desk"
            : user
              ? `おかえりなさい、${name}さん`
              : "Your Japanese study desk"}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-sumi-soft">
          {user
            ? "Here’s today’s plan — clear what’s due, continue your unit, and get some speaking in."
            : "Browse the kana and lessons right away. Sign in to save your progress and sync it across devices."}
        </p>
      </div>

      {!loading && !user ? (
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/signup"
            className="bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai"
          >
            Create free account
          </Link>
          <Link
            href="/signin"
            className="border border-line px-5 py-2.5 text-sm font-medium text-sumi transition-colors hover:border-sumi"
          >
            Sign in
          </Link>
        </div>
      ) : null}
    </section>
  );
}
