"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f3efe4",
          color: "#1a1b1e",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p style={{ fontSize: 40, margin: 0 }}>みんなの日本語</p>
          <h1 style={{ fontSize: 22, margin: "16px 0 8px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#565860", fontSize: 14, margin: 0 }}>
            The app hit an unexpected error. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              border: "1px solid #1a1b1e",
              background: "#1a1b1e",
              color: "#fbf9f3",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
