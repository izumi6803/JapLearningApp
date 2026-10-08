import { requireAdmin } from "@/lib/auth/guard";
import { json, sameOrigin } from "@/lib/auth/http";
import { updateLesson } from "@/lib/lessons/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request)) return json({ error: "bad_origin" }, 403);
  const admin = await requireAdmin();
  if (!admin) return json({ error: "forbidden" }, 403);

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const updated = await updateLesson(id, body);
  if (!updated) return json({ error: "not_found" }, 404);
  return json({ ok: true });
}
