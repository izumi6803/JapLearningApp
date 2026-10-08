import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { redirectAdminToConsole } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Minna no Nihongo study account.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await redirectAdminToConsole();
  const sp = await searchParams;
  const next = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <AuthScreen mode="signin" next={next} />
    </div>
  );
}
