"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-washi/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="group flex items-center gap-2.5"
        >
          <span
            aria-hidden="true"
            className="hanko hanko-fill"
            style={{ width: 30, height: 30, fontSize: 13 }}
          >
            学
          </span>
          <span className="leading-none">
            <span className="block font-display text-[15px] font-semibold tracking-wide">
              みんなの日本語
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.28em] text-sumi-soft">
              {isAdmin ? "Admin console" : "Study companion"}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-2.5 py-1.5 text-sm transition-colors sm:px-3"
                  style={{
                    color: active
                      ? "var(--color-sumi)"
                      : "var(--color-sumi-soft)",
                  }}
                >
                  <span className="font-medium sm:hidden">{item.kana}</span>
                  <span className="hidden font-medium sm:inline">
                    {item.label}
                  </span>
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

          <span aria-hidden="true" className="h-5 w-px bg-line" />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
