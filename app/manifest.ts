import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "みんなの日本語 — Minna no Nihongo Study Companion",
    short_name: "日本語",
    description:
      "Learn Japanese with kana, vocabulary, grammar, kanji, review and an AI tutor.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3efe4",
    theme_color: "#f3efe4",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
