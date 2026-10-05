"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getProgress,
  mergeProgress,
  setProgress,
  useProgress,
} from "@/lib/progress";
import type { ProgressState } from "@/lib/progress-types";

/**
 * Bridges the local (localStorage) progress store with the account on the
 * server: pulls on sign-in, merges, then pushes changes back (debounced).
 */
export function ProgressSync() {
  const { user, loading } = useAuth();
  const { state, ready } = useProgress();
  const userId = user?.id ?? null;
  const pulledFor = useRef<string | null>(null);
  const lastPushed = useRef(0);

  useEffect(() => {
    if (loading || !ready) return;
    if (!userId) {
      pulledFor.current = null;
      return;
    }
    if (pulledFor.current === userId) return;
    pulledFor.current = userId;
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { progress: ProgressState | null };
        if (!active) return;
        const local = getProgress();
        const merged = data.progress ? mergeProgress(local, data.progress) : local;
        setProgress(merged);
        const committed = getProgress();
        const put = await fetch("/api/progress", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ progress: committed }),
        });
        if (put.ok) lastPushed.current = committed.updatedAt;
      } catch {
        /* offline — keep local */
      }
    })();

    return () => {
      active = false;
    };
  }, [userId, loading, ready]);

  useEffect(() => {
    if (!userId || !ready) return;
    if (state.updatedAt === lastPushed.current) return;
    const timer = setTimeout(() => {
      fetch("/api/progress", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ progress: state }),
      })
        .then((r) => {
          if (r.ok) lastPushed.current = state.updatedAt;
        })
        .catch(() => {});
    }, 1000);
    return () => clearTimeout(timer);
  }, [state, userId, ready]);

  return null;
}
