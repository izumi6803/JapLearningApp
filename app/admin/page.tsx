import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage student accounts.",
};

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/signin?next=/admin");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ai">
          管理 · Admin
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-sumi">
          Account management
        </h1>
        <p className="mt-2 max-w-lg text-sm text-sumi-soft">
          Signed in as {admin.email}. Disable, delete, or reset passwords for
          student accounts, and edit lesson content.
        </p>
        <Link
          href="/admin/lessons"
          className="mt-4 inline-flex items-center gap-2 border border-ai px-4 py-2 text-sm font-medium text-ai transition-colors hover:bg-ai hover:text-paper"
        >
          教材 Manage lessons →
        </Link>
      </header>

      <AdminUsers selfId={admin.id} />
    </div>
  );
}
