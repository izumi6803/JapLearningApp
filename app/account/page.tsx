import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountView } from "@/components/account/AccountView";
import { currentUser } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My account",
  description: "Manage your Minna no Nihongo account.",
};

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/signin?next=/account");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          アカウント · Account
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          My account
        </h1>
      </header>

      <AccountView />
    </div>
  );
}
