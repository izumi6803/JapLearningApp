import type { Metadata } from "next";
import { ForgotForm } from "@/components/auth/ForgotForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Minna no Nihongo password.",
};

export default function ForgotPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <header className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
            再設定 · Reset
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-sumi">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-sumi-soft">
            Enter your email and we’ll send a reset link.
          </p>
        </header>
        <div className="mt-8 flex justify-center">
          <ForgotForm />
        </div>
      </div>
    </div>
  );
}
