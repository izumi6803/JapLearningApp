"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Hanko } from "@/components/Hanko";
import { useProgress } from "@/lib/progress";

const MESSAGES: Record<string, string> = {
  weak_password: "Use at least 8 characters.",
  invalid_credentials: "Current password is incorrect.",
  unauthorized: "Your session expired. Sign in again.",
};

export function AccountView() {
  const { user, loading, refresh, signOut } = useAuth();
  const { reset } = useProgress();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  if (loading) {
    return <p className="text-sm text-sumi-soft">Loading…</p>;
  }
  if (!user) {
    return (
      <p className="text-sm text-sumi-soft">
        Not signed in.{" "}
        <Link href="/signin" className="text-ai underline underline-offset-4">
          Sign in
        </Link>
      </p>
    );
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "failed");
      setMessage({ ok: true, text: "Password updated." });
      setCurrent("");
      setNext("");
      await refresh();
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setMessage({
        ok: false,
        text: MESSAGES[code] ?? "Could not update your password.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="border border-line bg-paper p-6">
        <div className="flex items-start gap-5">
          <Hanko size={56} label={user.role === "admin" ? "管" : "生"} />
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold text-sumi">
              {user.name ?? "Student"}
            </h2>
            <p className="font-mono text-[12px] text-sumi-soft">{user.email}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ai">
              {user.role === "admin" ? "Admin" : "Student"} ·{" "}
              {user.provider === "google" ? "Google account" : "Email account"}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-sumi">
          {user.hasPassword === false ? "Set a password" : "Change password"}
        </h2>
        <p className="mt-1 text-sm text-sumi-soft">
          {user.hasPassword === false
            ? "You signed in with Google. Set a password to also sign in with email."
            : "Update the password used for email sign-in."}
        </p>

        <form onSubmit={changePassword} className="mt-4 max-w-md space-y-4">
          {user.hasPassword !== false ? (
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
                Current password
              </span>
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-1.5 w-full border border-line bg-washi px-3 py-2.5 text-sm outline-none focus:border-ai"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
              New password
            </span>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className="mt-1.5 w-full border border-line bg-washi px-3 py-2.5 text-sm outline-none focus:border-ai"
            />
            <span className="mt-1 block font-mono text-[10px] text-sumi-soft">
              At least 8 characters
            </span>
          </label>

          {message ? (
            <p
              className="border-l-2 px-3 py-2 text-sm"
              style={{
                borderColor: message.ok
                  ? "var(--color-matcha)"
                  : "var(--color-shu)",
                color: message.ok ? "var(--color-matcha)" : "var(--color-shu)",
              }}
            >
              {message.text}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save password"}
          </button>
        </form>
      </section>

      <section className="border-t border-line pt-6">
        <h2 className="font-display text-lg font-semibold text-sumi">
          Study data
        </h2>
        <p className="mt-1 max-w-md text-sm text-sumi-soft">
          Progress is saved to your account. Resetting clears it on this
          account and this browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all study progress for this account?")) {
                reset();
              }
            }}
            className="border border-shu px-4 py-2 text-sm font-medium text-shu transition-colors hover:bg-shu hover:text-paper"
          >
            Reset study progress
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="border border-line px-4 py-2 text-sm font-medium text-sumi transition-colors hover:border-sumi"
          >
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
