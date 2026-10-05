"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

function Avatar({
  image,
  name,
  size = 28,
}: {
  image: string | null;
  name: string | null;
  size?: number;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="grid place-items-center rounded-full bg-ai font-display text-paper"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {initial}
    </span>
  );
}

export function AccountMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <span className="block h-7 w-20 animate-pulse bg-line" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href="/signin"
          className="px-2.5 py-1.5 text-sm font-medium text-sumi-soft transition-colors hover:text-sumi"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="hidden border border-sumi bg-sumi px-3 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-ai sm:inline-flex"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 border border-line px-2 py-1 transition-colors hover:border-sumi"
      >
        <Avatar image={user.image} name={user.name ?? user.email} />
        <span className="hidden max-w-[8rem] truncate text-sm font-medium text-sumi sm:inline">
          {user.name ?? user.email}
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 border border-line bg-paper p-1 shadow-[0_18px_50px_-30px_rgba(26,27,30,0.6)]"
          >
            <div className="border-b border-line px-3 py-2.5">
              <p className="truncate text-sm font-medium text-sumi">
                {user.name ?? "Signed in"}
              </p>
              <p className="truncate font-mono text-[11px] text-sumi-soft">
                {user.email}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ai">
                {user.role === "admin" ? "Admin" : "Student"}
                {user.provider === "google" ? " · via Google" : ""}
              </p>
            </div>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="mt-1 block w-full px-3 py-2 text-left text-sm text-sumi transition-colors hover:bg-washi"
            >
              My account
            </Link>
            {user.role === "admin" ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block w-full px-3 py-2 text-left text-sm text-sumi transition-colors hover:bg-washi"
              >
                Admin console
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="mt-1 w-full border-t border-line px-3 py-2 text-left text-sm text-sumi transition-colors hover:bg-washi"
            >
              Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
