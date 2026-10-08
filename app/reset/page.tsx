import type { Metadata } from "next";
import { ResetForm } from "@/components/auth/ResetForm";
import { redirectAdminToConsole } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Choose a new password for your account.",
};

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await redirectAdminToConsole();
  const sp = await searchParams;
  const token = Array.isArray(sp.token) ? sp.token[0] : sp.token;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
            新しいパスワード
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-sumi">
            Set a new password
          </h1>
        </header>
        <div className="flex justify-center">
          <ResetForm token={token} />
        </div>
      </div>
    </div>
  );
}
