import { currentUser } from "@/lib/auth/guard";
import { json, sameOrigin } from "@/lib/auth/http";
import { getProgress, saveProgress } from "@/lib/auth/repository";
import { sanitizeProgress } from "@/lib/progress-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (!user) return json({ error: "unauthorized" }, 401);
  const progress = await getProgress(user.id);
  return json({ progress });
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);
  const user = await currentUser();
  if (!user) return json({ error: "unauthorized" }, 401);
  let body: { progress?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  const progress = sanitizeProgress(body.progress);
  await saveProgress(user.id, progress);
  return json({ ok: true });
}
