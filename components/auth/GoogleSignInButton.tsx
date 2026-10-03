"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

interface GoogleIdentity {
  initialize: (options: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: Record<string, unknown>,
  ) => void;
}

function googleIdentity(): GoogleIdentity | undefined {
  const w = window as unknown as {
    google?: { accounts?: { id?: GoogleIdentity } };
  };
  return w.google?.accounts?.id;
}

export function GoogleSignInButton({ next }: { next?: string }) {
  const { signInWithGoogle } = useAuth();
  const holder = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CLIENT_ID || !scriptReady) return;
    const id = googleIdentity();
    if (!id || !holder.current) return;

    id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => {
        signInWithGoogle(response.credential)
          .then(() => {
            window.location.assign(next && next.startsWith("/") ? next : "/");
          })
          .catch((err: Error) => setError(err.message));
      },
    });
    id.renderButton(holder.current, {
      theme: "outline",
      size: "large",
      width: 280,
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
    });
  }, [scriptReady, signInWithGoogle, next]);

  if (!CLIENT_ID) {
    return (
      <div className="border border-dashed border-line px-4 py-3 text-center text-xs text-sumi-soft">
        Google sign-in isn&apos;t configured. Set{" "}
        <code className="font-mono text-ai">
          NEXT_PUBLIC_GOOGLE_CLIENT_ID
        </code>{" "}
        in <code className="font-mono">.env.local</code>.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setError("Could not load Google sign-in.")}
      />
      <div ref={holder} />
      {error ? <p className="text-xs text-shu">{error}</p> : null}
    </div>
  );
}
