import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/auth/config";

export default function robots(): MetadataRoute.Robots {
  const base = appUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
