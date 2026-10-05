"use client";

import { useEffect, useState } from "react";
import { Hanko } from "@/components/Hanko";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  provider: "credentials" | "google";
  role: "student" | "admin";
  status: "active" | "disabled";
  createdAt: string;
  lastLoginAt: string | null;
}

function randomPassword(): string {
  const words = ["sakura", "fuji", "matcha", "kaze", "hoshi", "umi", "yama", "kumo"];
  const w = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${w}-${n}-kotoba`;
}

function fmt(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminUsers({ selfId }: { selfId: string }) {
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDq(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/users?q=${encodeURIComponent(dq)}&limit=100`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { users: AdminUser[]; total: number }) => {
        setUsers(data.users);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => controller.abort();
  }, [dq, reloadKey]);

  async function toggleStatus(user: AdminUser) {
    const next = user.status === "active" ? "disabled" : "active";
    setBusy(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "failed");
      setNotice(
        next === "disabled"
          ? `Disabled ${user.email}`
          : `Re-enabled ${user.email}`,
      );
      setReloadKey((k) => k + 1);
    } catch {
      setNotice("Could not update that account.");
    } finally {
      setBusy(null);
    }
  }

  async function resetPassword(user: AdminUser) {
    const password = randomPassword();
    setBusy(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      setNotice(`New password for ${user.email}: ${password}`);
      setReloadKey((k) => k + 1);
    } catch {
      setNotice("Could not reset that password.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(user: AdminUser) {
    if (!window.confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    setBusy(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotice(`Deleted ${user.email}`);
      setReloadKey((k) => k + 1);
    } catch {
      setNotice("Could not delete that account.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sumi-soft">
          {loading ? "Loading…" : `${total} account${total === 1 ? "" : "s"}`}
        </p>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email…"
          className="w-full max-w-xs border border-line bg-paper px-3 py-1.5 text-sm outline-none transition-colors placeholder:text-sumi-soft/60 focus:border-ai"
        />
      </div>

      {notice ? (
        <div className="mt-4 flex items-start justify-between gap-3 border-l-2 border-matcha bg-matcha/10 px-3 py-2">
          <p className="font-mono text-xs text-sumi">{notice}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs text-sumi-soft hover:text-sumi"
          >
            dismiss
          </button>
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.16em] text-sumi-soft">
              <th className="px-3 py-2 font-normal">Account</th>
              <th className="px-3 py-2 font-normal">Role</th>
              <th className="px-3 py-2 font-normal">Provider</th>
              <th className="px-3 py-2 font-normal">Status</th>
              <th className="px-3 py-2 font-normal">Joined</th>
              <th className="px-3 py-2 font-normal">Last login</th>
              <th className="px-3 py-2 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line align-middle">
                <td className="px-3 py-2.5">
                  <div className="font-medium text-sumi">
                    {u.name ?? "—"}
                    {u.id === selfId ? (
                      <span className="ml-2 font-mono text-[10px] uppercase text-ai">
                        you
                      </span>
                    ) : null}
                  </div>
                  <div className="font-mono text-[11px] text-sumi-soft">
                    {u.email}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sumi-soft">
                    {u.role === "admin" ? "admin" : "student"}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-sumi-soft">
                  {u.provider === "google" ? "Google" : "Email"}
                </td>
                <td className="px-3 py-2.5">
                  {u.status === "active" ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-matcha">
                      active
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-shu">
                      disabled
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-sumi-soft">
                  {fmt(u.createdAt)}
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-sumi-soft">
                  {fmt(u.lastLoginAt)}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={busy === u.id}
                      onClick={() => toggleStatus(u)}
                      className="border border-line px-2 py-1 text-xs transition-colors hover:border-ai hover:text-ai disabled:opacity-40"
                    >
                      {u.status === "active" ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      disabled={busy === u.id}
                      onClick={() => resetPassword(u)}
                      className="border border-line px-2 py-1 text-xs transition-colors hover:border-kin hover:text-kin disabled:opacity-40"
                    >
                      Reset pw
                    </button>
                    <button
                      type="button"
                      disabled={busy === u.id || u.id === selfId}
                      onClick={() => remove(u)}
                      className="border border-line px-2 py-1 text-xs transition-colors hover:border-shu hover:text-shu disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sumi-soft">
                  No accounts match “{dq}”.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-3 text-sumi-soft">
        <Hanko size={30} label="管" />
        <p className="text-xs">
          Admins can disable, delete, and reset passwords. Role is granted by
          the <span className="font-mono text-ai">ADMIN_EMAILS</span> allowlist.
        </p>
      </div>
    </div>
  );
}
