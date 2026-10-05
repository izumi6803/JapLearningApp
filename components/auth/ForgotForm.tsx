"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(
          data.error === "email_not_configured"
            ? "Email reset isn’t set up yet. Ask an admin to reset your password, or sign in with Google."
            : "Could not send the email right now. Try again later.",
        );
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-line bg-paper p-6 text-sm text-sumi">
        <p className="font-display text-lg font-semibold">Check your inbox</p>
        <p className="mt-2 text-sumi-soft">
          If an account exists for <span className="font-mono">{email}</span>,
          we’ve sent a reset link. It expires in 30 minutes.
        </p>
        <Link
          href="/signin"
          className="mt-4 inline-block text-ai underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
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
        {busy ? "Sending…" : "Send reset link"}
      </button>

      <p className="text-sm text-sumi-soft">
        <Link href="/signin" className="text-ai underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
