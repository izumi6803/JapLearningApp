import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Minna no Nihongo Companion — Learn Japanese, N5 to N1";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3efe4",
          padding: 72,
          color: "#1a1b1e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#c0362c",
              color: "#fbf9f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              borderRadius: 6,
            }}
          >
            N5
          </div>
          <div style={{ fontSize: 26, letterSpacing: 4, color: "#565860" }}>
            MINNA NO NIHONGO COMPANION
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.02 }}>
            Learn Japanese,
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.02 }}>
            N5 to N1.
          </div>
          <div style={{ fontSize: 30, color: "#565860", marginTop: 8 }}>
            Kana · Vocabulary · Grammar · Kanji · Review · AI tutor
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 22, color: "#565860" }}>
          <span>Free</span>
          <span>·</span>
          <span>Runs in any browser</span>
          <span>·</span>
          <span>Progress synced</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
