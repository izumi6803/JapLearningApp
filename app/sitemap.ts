import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/auth/config";
import { getLessons } from "@/lib/lessons/repository";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = appUrl.replace(/\/$/, "");
  const now = new Date();

  const staticPaths = [
    "",
    "/kana",
    "/lessons",
    "/review",
    "/roadmap",
    "/study",
    "/tutor",
    "/progress",
    "/signin",
    "/signup",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map(
    (path): MetadataRoute.Sitemap[number] => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    }),
  );

  let lessonRoutes: MetadataRoute.Sitemap = [];
  try {
    const lessons = await getLessons();
    lessonRoutes = lessons.map(
      (lesson): MetadataRoute.Sitemap[number] => ({
        url: `${base}/lessons/${lesson.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    );
  } catch {
    /* no database available during build — skip lesson URLs */
  }

  return [...staticRoutes, ...lessonRoutes];
}
