import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/AuthScreen";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free Minna no Nihongo study account.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const next = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <AuthScreen mode="signup" next={next} />
    </div>
  );
}
