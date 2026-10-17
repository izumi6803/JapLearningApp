"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { AccountMenu } from "./auth/AccountMenu";

const STUDENT_NAV = [
  { href: "/kana", label: "Kana", kana: "かな", exact: false },
  { href: "/lessons", label: "Lessons", kana: "課", exact: false },
  { href: "/review", label: "Review", kana: "復習", exact: false },
  { href: "/roadmap", label: "Roadmap", kana: "計画", exact: false },
  { href: "/study", label: "Study", kana: "練習", exact: false },
  { href: "/tutor", label: "Tutor", kana: "先生", exact: false },
  { href: "/progress", label: "Progress", kana: "進捗", exact: false },
] as const;

const ADMIN_NAV = [
  { href: "/admin", label: "Accounts", kana: "管理", exact: true },
  { href: "/admin/lessons", label: "Lessons", kana: "教材", exact: false },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const items = isAdmin ? ADMIN_NAV : STUDENT_NAV;
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-washi/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={isAdmin ? "/admin" : "/"}
          onClick={() => setOpen(false)}
          className="flex min-w-0 items-center gap-2.5"
        >
          <span
            aria-hidden="true"
            className="hanko hanko-fill shrink-0"
            style={{ width: 30, height: 30, fontSize: 13 }}
          >
            学
          </span>
          <span className="min-w-0 leading-none">
            <span className="block truncate font-display text-[15px] font-semibold tracking-wide">
              みんなの日本語
            </span>
            <span className="block truncate font-mono text-[9px] uppercase tracking-[0.28em] text-sumi-soft">
              {isAdmin ? "Admin console" : "Study companion"}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 sm:flex">
            {items.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-2.5 py-1.5 text-sm transition-colors sm:px-3"
                  style={{
                    color: active ? "var(--color-sumi)" : "var(--color-sumi-soft)",
                  }}
                >
                  <span className="font-medium">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 -bottom-0.5 h-[2px] origin-left transition-transform duration-300"
                    style={{
                      backgroundColor: "var(--color-shu)",
                      transform: active ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          <AccountMenu />

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-9 w-9 shrink-0 place-items-center border border-line text-sumi transition-colors hover:border-sumi sm:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-line bg-paper sm:hidden">
          <ul className="mx-auto max-w-6xl px-2 py-1">
            {items.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-base transition-colors"
                    style={{
                      color: active ? "var(--color-sumi)" : "var(--color-sumi-soft)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-sm"
                      style={{ color: "var(--color-ai)" }}
                    >
                      {item.kana}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className="ml-auto font-display text-sumi-soft"
                    >
                      へ
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
