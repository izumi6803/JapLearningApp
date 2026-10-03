"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { GoogleSignInButton } from "./GoogleSignInButton";

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Email or password is incorrect.",
  email_taken: "An account already uses that email.",
  weak_password: "Use at least 8 characters.",
  invalid_email: "Enter a valid email address.",
  name_required: "Please enter your name.",
  use_google: "This account signs in with Google.",
  google_not_configured: "Google sign-in is not configured.",
  invalid_google_token: "Google could not verify that account.",
  server_error: "Something went wrong on our side. Try again.",
  bad_origin: "Request blocked for security. Reload and retry.",
};

export function AuthScreen({
  mode,
  next,
}: {
  mode: "signin" | "signup";
  next?: string;
}) {
  const { signIn, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isSignup) await signUp(name, email, password);
      else await signIn(email, password);
      window.location.assign(next && next.startsWith("/") ? next : "/");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(MESSAGES[code] ?? "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <header className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          {isSignup ? "登録 · Sign up" : "ログイン · Sign in"}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-sumi">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-sumi-soft">
          {isSignup
            ? "Keep your study streak with a free account."
            : "Sign in to pick up where you left off."}
        </p>
      </header>

      <div className="mt-8 border border-line bg-paper p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {isSignup ? (
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
                Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="mt-1.5 w-full border border-line bg-washi px-3 py-2.5 text-sm outline-none transition-colors focus:border-ai"
              />
            </label>
          ) : null}

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
              className="mt-1.5 w-full border border-line bg-washi px-3 py-2.5 text-sm outline-none transition-colors focus:border-ai"
            />
          </label>

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={isSignup ? 8 : undefined}
              required
              className="mt-1.5 w-full border border-line bg-washi px-3 py-2.5 text-sm outline-none transition-colors focus:border-ai"
            />
            {isSignup ? (
              <span className="mt-1 block font-mono text-[10px] text-sumi-soft">
                At least 8 characters
              </span>
            ) : null}
          </label>

          {error ? (
            <p
              role="alert"
              className="border-l-2 border-shu bg-shu/5 px-3 py-2 text-sm text-shu"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-sumi px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ai disabled:opacity-50"
          >
            {busy
              ? "Please wait…"
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sumi-soft">
            or
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <GoogleSignInButton next={next} />
      </div>

      <p className="mt-5 text-center text-sm text-sumi-soft">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link
              href="/signup"
              className="font-medium text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai"
            >
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
