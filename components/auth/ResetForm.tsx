"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function ResetForm({ token }: { token?: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!token) {
    return (
      <div className="max-w-md border border-line bg-paper p-6 text-sm">
        <p className="font-display text-lg font-semibold text-sumi">
          Invalid or missing link
        </p>
        <p className="mt-2 text-sumi-soft">
          Request a new reset link from the sign-in page.
        </p>
        <Link
          href="/forgot"
          className="mt-4 inline-block text-ai underline underline-offset-4"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don’t match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(
          data.error === "weak_password"
            ? "Use at least 8 characters."
            : "This link is invalid or has expired.",
        );
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-md border border-line bg-paper p-6 text-sm">
        <p className="font-display text-lg font-semibold text-sumi">
          Password updated
        </p>
        <p className="mt-2 text-sumi-soft">
          You can now sign in with your new password.
        </p>
        <Link
          href="/signin"
          className="mt-4 inline-block bg-sumi px-5 py-2.5 font-medium text-paper transition-colors hover:bg-ai"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
          New password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-ai"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
          Confirm password
        </span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-ai"
        />
      </label>

      {error ? (
        <p className="border-l-2 border-shu bg-shu/5 px-3 py-2 text-sm text-shu">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai disabled:opacity-50"
      >
        {busy ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
