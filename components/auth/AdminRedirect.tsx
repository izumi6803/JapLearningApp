"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

/**
 * Admins live in the console. Doing this on the client keeps every student
 * page free of cookies() so they can be prerendered and served from the CDN.
 */
export function AdminRedirect() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/account")) return;
    router.replace("/admin");
  }, [user, pathname, router]);

  return null;
}
